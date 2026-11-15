-- PROTOTYPE ONLY. DROP BEFORE LAUNCH: lets a signed-in seller start a plan without paying, standing in
-- for App Store / Google Play purchases verified on the server (R-3). Replace with a receipt-verifying webhook.
create or replace function public.prototype_start_plan(plan_name text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if plan_name not in ('reseller', 'pass') then
    raise exception 'Unknown plan';
  end if;
  update public.profiles
     set plan = plan_name,
         plan_ends_at = case when plan_name = 'pass' then now() + interval '30 days' else null end
   where id = auth.uid();
end $$;
comment on function public.prototype_start_plan(text) is 'PROTOTYPE ONLY - drop before launch. Stand-in for verified store purchases (R-3).';
revoke execute on function public.prototype_start_plan(text) from anon, public;
grant execute on function public.prototype_start_plan(text) to authenticated;
