-- Create storage bucket for renovation attachments
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload files
create policy "Authenticated users can upload" on storage.objects
  for insert with check (
    bucket_id = 'attachments' and auth.role() = 'authenticated'
  );

-- Allow authenticated users to read files
create policy "Authenticated users can read" on storage.objects
  for select using (
    bucket_id = 'attachments' and auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their own files
create policy "Authenticated users can delete" on storage.objects
  for delete using (
    bucket_id = 'attachments' and auth.role() = 'authenticated'
  );
