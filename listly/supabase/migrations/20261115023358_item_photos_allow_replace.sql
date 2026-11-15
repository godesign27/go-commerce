-- Uploads use "replace if it exists" (upsert), which needs an update policy. Own folder only.
create policy "Sellers replace their own photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'item-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
