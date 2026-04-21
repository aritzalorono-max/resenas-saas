-- Migration 006: Incentivo por reseñas 5 estrellas
-- Añade la opción de ofrecer un descuento/regalo a clientes que dejen reseña 5★

-- Nuevos campos en la tabla businesses
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS incentive_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS incentive_description TEXT;

-- Nuevos estados en review_requests
ALTER TABLE review_requests
  DROP CONSTRAINT IF EXISTS review_requests_status_check;

ALTER TABLE review_requests
  ADD CONSTRAINT review_requests_status_check
  CHECK (status IN (
    'pending',
    'positive',
    'negative',
    'neutral',
    'no_response',
    'awaiting_screenshot',
    'rewarded'
  ));
