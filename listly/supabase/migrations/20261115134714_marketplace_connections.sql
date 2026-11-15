-- Marketplace connections (DD-46, R-35). Tokens are encrypted by the Edge Functions before storage and the
-- token columns are never readable by the app. All writes go through Edge Functions (service role).
create table public.marketplace_connections (
  user_id uuid not null references auth.users(id) on delete cascade,
  marketplace text not null check (marketplace in ('ebay', 'depop')),
  status text not null default 'connected' check (status in ('connected', 'needs_reconnect')),
  account_name text,
  environment text not null default 'sandbox' check (environment in ('sandbox', 'production')),
  settings jsonb not null default '{}'::jsonb, -- ship-from postal code, policy ids, location key
  access_token_enc text,
  refresh_token_enc text,
  access_expires_at timestamptz,
  refresh_expires_at timestamptz,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, marketplace)
);
alter table public.marketplace_connections enable row level security;
create policy "Sellers see their own connections" on public.marketplace_connections
  for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.marketplace_connections from anon, authenticated;
grant select (user_id, marketplace, status, account_name, environment, settings, connected_at, updated_at)
  on public.marketplace_connections to authenticated;
create trigger marketplace_connections_updated_at before update on public.marketplace_connections
  for each row execute function public.set_updated_at();

-- One-time OAuth state, checked on the callback (CSRF). Server only.
create table public.oauth_states (
  state text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  marketplace text not null,
  redirect_to text not null,
  created_at timestamptz not null default now()
);
alter table public.oauth_states enable row level security;
revoke all on public.oauth_states from anon, authenticated;

-- Where each item is live via an API, e.g. {"ebay": {"listingId": "...", "offerId": "...", "url": "..."}}.
-- Written only by the Edge Functions.
alter table public.items add column external jsonb not null default '{}'::jsonb;
