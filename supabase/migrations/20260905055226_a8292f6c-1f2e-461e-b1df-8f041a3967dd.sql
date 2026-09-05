CREATE POLICY "media_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media_authenticated_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND owner = auth.uid());
CREATE POLICY "media_owner_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND owner = auth.uid()) WITH CHECK (bucket_id = 'media' AND owner = auth.uid());
CREATE POLICY "media_owner_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND owner = auth.uid());