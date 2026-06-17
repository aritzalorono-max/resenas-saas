-- migration_027: Missing indexes for Google Business and discount_codes queries
--
-- These indexes eliminate sequential scans triggered by production queries
-- that filter on business_id without a supporting index.

-- google_review_replies: /api/google-business/reviews fetches all replies for a business
-- to annotate the "replied" flag on each review card.
CREATE INDEX IF NOT EXISTS idx_google_review_replies_business
  ON google_review_replies(business_id);

-- google_review_flags: same route fetches all flagged reviews for a business.
CREATE INDEX IF NOT EXISTS idx_google_review_flags_business
  ON google_review_flags(business_id);

-- discount_codes: /incentivos page fetches codes ordered by created_at DESC.
-- The existing idx_discount_codes_business_status covers (business_id, status)
-- but that index cannot serve an ORDER BY created_at DESC without a sort step.
CREATE INDEX IF NOT EXISTS idx_discount_codes_business_date
  ON discount_codes(business_id, created_at DESC);
