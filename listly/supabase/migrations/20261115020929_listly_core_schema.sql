-- Listly MVP 1: profiles, items, trial and drafting. Every table has row-level security (S-02).

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- One profile per seller. Plan and trial count are server-owned (R-1, R-3): sellers can't write them.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text check (plan in ('reseller', 'pass')),
  plan_ends_at timestamptz,
  free_left integer not null default 3 check (free_left between 0 and 3),
  markets text[] not null default '{}',
  ship_by text not null default 'buyer' check (ship_by in ('buyer', 'me', 'free')),
  default_bin text not null default 'B1' check (char_length(default_bin) <= 40),
  keep_undo boolean not null default false,
  ai_notice_version integer,
  ai_notice_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Sellers read their own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "Sellers update their own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Only these settings are writable from the app.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (markets, ship_by, default_bin, keep_undo, ai_notice_version, ai_notice_at) on public.profiles to authenticated;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- A profile is created with every new account.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from anon, authenticated, public;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Items: one row per thing the seller is selling.
create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) <= 200),
  facts jsonb not null default '{}'::jsonb,
  drafted boolean not null default false,
  price numeric(10, 2) check (price >= 0),
  status text not null default 'ready' check (status in ('ready', 'listed', 'sold')),
  listed_on text[] not null default '{}',
  removed text[] not null default '{}',
  cost numeric(10, 2) check (cost >= 0), -- null = not entered; 0 is a real cost (DD-18)
  sale jsonb,
  history jsonb not null default '[]'::jsonb,
  photo_paths text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index items_user_id_idx on public.items (user_id);
alter table public.items enable row level security;

create policy "Sellers read their own items" on public.items
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Sellers add their own items" on public.items
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Sellers change their own items" on public.items
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Sellers delete their own items" on public.items
  for delete to authenticated using (user_id = (select auth.uid()));

-- "drafted" is set only by draft_items(), so the trial can't be skipped from the app.
revoke insert, update on public.items from anon, authenticated;
grant select, delete on public.items to authenticated;
grant insert (id, name, facts, price, status, listed_on, removed, cost, sale, history, photo_paths) on public.items to authenticated;
grant update (name, facts, price, status, listed_on, removed, cost, sale, history, photo_paths) on public.items to authenticated;

create trigger items_updated_at before update on public.items
  for each row execute function public.set_updated_at();

-- Drafts the caller's items that their plan allows, and spends free listings for a trial (R-1, D-1).
-- Returns the ids that were drafted. A trial drafts at most what's left of its 3.
create or replace function public.draft_items(item_ids uuid[]) returns uuid[]
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  p public.profiles;
  budget integer;
  allowed uuid[];
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;
  select * into p from public.profiles where id = uid for update;
  if not found then
    raise exception 'No profile';
  end if;
  budget := case when p.plan is not null and (p.plan_ends_at is null or p.plan_ends_at > now()) then 2147483647 else p.free_left end;

  select coalesce(array_agg(id), '{}') into allowed from (
    select i.id from public.items i
    where i.user_id = uid and i.id = any(item_ids) and not i.drafted
    order by array_position(item_ids, i.id)
    limit greatest(budget, 0)
  ) s;

  update public.items set drafted = true where user_id = uid and id = any(allowed);
  if p.plan is null or (p.plan_ends_at is not null and p.plan_ends_at <= now()) then
    update public.profiles set free_left = greatest(0, free_left - coalesce(array_length(allowed, 1), 0)) where id = uid;
  end if;
  return allowed;
end $$;
revoke execute on function public.draft_items(uuid[]) from anon, public;
grant execute on function public.draft_items(uuid[]) to authenticated;

-- Private photo storage: each seller can only touch their own folder ({user id}/...).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('item-photos', 'item-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/heic', 'image/webp'])
on conflict (id) do nothing;

create policy "Sellers read their own photos" on storage.objects
  for select to authenticated using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Sellers upload their own photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'item-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Sellers delete their own photos" on storage.objects
  for delete to authenticated using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
