-- Migration 007: Plataformas de reseñas múltiples
-- Sustituye el único campo google_maps_url por una lista de plataformas configurable.
-- google_maps_url se mantiene como la URL activa (la que se envía a los clientes).

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS review_links JSONB NOT NULL DEFAULT '[]'::jsonb;
