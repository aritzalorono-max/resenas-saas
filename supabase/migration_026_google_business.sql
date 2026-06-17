-- Migration 026: Google Business Profile management module
-- Adds OAuth tokens storage and review management tables

-- Store OAuth tokens per business
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS google_access_token TEXT,
  ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS google_token_expiry TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS google_account_name TEXT, -- e.g. "accounts/123456789"
  ADD COLUMN IF NOT EXISTS google_location_name TEXT; -- e.g. "accounts/123/locations/456"

-- Track reply status for Google reviews
CREATE TABLE IF NOT EXISTS google_review_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  review_name TEXT NOT NULL, -- Google review resource name
  reply_text TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(review_name)
);

-- Track flagged reviews
CREATE TABLE IF NOT EXISTS google_review_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  review_name TEXT NOT NULL,
  reviewer_name TEXT,
  review_text TEXT,
  flag_reason TEXT NOT NULL,
  complaint_email_text TEXT NOT NULL,
  flagged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'resolved')),
  UNIQUE(review_name)
);

ALTER TABLE google_review_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_review_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own replies" ON google_review_replies
  FOR ALL USING (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Users access own flags" ON google_review_flags
  FOR ALL USING (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );
