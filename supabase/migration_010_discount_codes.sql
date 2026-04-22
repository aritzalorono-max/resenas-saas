-- Migration 010: discount_codes table + new columns in businesses and review_requests

-- ── 1. New columns in businesses ─────────────────────────────────────────────
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS incentive_code_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS incentive_code_type TEXT NOT NULL DEFAULT 'random'
    CHECK (incentive_code_type IN ('random', 'pool'));

-- ── 2. New column in review_requests ─────────────────────────────────────────
ALTER TABLE review_requests
  ADD COLUMN IF NOT EXISTS discount_code TEXT;

-- ── 3. discount_codes table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS discount_codes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  code              TEXT NOT NULL,
  type              TEXT NOT NULL DEFAULT 'random' CHECK (type IN ('random', 'pool')),
  status            TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'used', 'expired')),
  review_request_id UUID REFERENCES review_requests(id) ON DELETE SET NULL,
  used_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookup: available pool codes for a business
CREATE INDEX IF NOT EXISTS idx_discount_codes_business_status
  ON discount_codes(business_id, status);

-- ── 4. Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own business discount codes"
  ON discount_codes FOR ALL
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );
