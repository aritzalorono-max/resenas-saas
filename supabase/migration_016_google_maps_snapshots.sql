-- Migration 016: Google Maps rating tracking
-- Almacena el Place ID resuelto en businesses y guarda un snapshot diario
-- de la puntuación y número de reseñas de cada negocio.

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS google_place_id TEXT;

CREATE TABLE IF NOT EXISTS google_maps_snapshots (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID        NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  place_id     TEXT        NOT NULL,
  rating       NUMERIC(3,1),
  review_count INTEGER,
  fetched_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gm_snapshots_business_date
  ON google_maps_snapshots(business_id, fetched_at DESC);

-- RLS: cada usuario solo ve los snapshots de su negocio
ALTER TABLE google_maps_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_snapshots"
  ON google_maps_snapshots FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );
