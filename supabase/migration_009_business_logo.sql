-- Añade columna logo_url a businesses
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Bucket de almacenamiento para logos (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso al bucket
CREATE POLICY "logos_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

CREATE POLICY "logos_auth_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "logos_auth_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'logos');

CREATE POLICY "logos_auth_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'logos');
