-- The app saves items with an upsert, which Postgres runs as "update every column sent", including id.
-- Allow id in the update grant so upserts work, and refuse any update that would actually change it.
grant update (id) on public.items to authenticated;

create or replace function public.items_keep_id() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.id <> old.id then
    raise exception 'An item''s id can''t be changed';
  end if;
  if new.user_id <> old.user_id then
    raise exception 'An item can''t move to another seller';
  end if;
  return new;
end $$;

create trigger items_keep_id before update on public.items
  for each row execute function public.items_keep_id();
