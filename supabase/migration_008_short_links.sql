-- Migration 008: Acortador de URLs para plataformas de reseñas
-- Los enlaces largos de Google Maps, Trustpilot, etc. se acortan a /r/[code]

CREATE TABLE IF NOT EXISTS short_links (
  code        TEXT        PRIMARY KEY,
  url         TEXT        NOT NULL,
  business_id UUID        NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;

-- El negocio propietario puede crear y actualizar sus enlaces
CREATE POLICY "short_links_owner_write" ON short_links
  USING  (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Cualquiera puede leer (necesario para que el redirect funcione sin sesión)
CREATE POLICY "short_links_public_read" ON short_links
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS short_links_business_id_idx ON short_links (business_id);
