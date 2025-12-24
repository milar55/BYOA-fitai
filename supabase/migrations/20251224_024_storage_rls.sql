-- Storage RLS Policies for meal-photos bucket
-- Run this in the Supabase SQL Editor

-- 1. Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('meal-photos', 'meal-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload to their own folder
CREATE POLICY "Allow authenticated uploads to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'meal-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow authenticated users to update their own photos
CREATE POLICY "Allow authenticated updates to own folder"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'meal-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow public to read photos (since it's a public bucket)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'meal-photos');

-- 5. Allow users to delete their own photos
CREATE POLICY "Allow users to delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'meal-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

