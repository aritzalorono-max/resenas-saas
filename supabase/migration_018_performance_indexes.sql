-- migration_018: Performance indexes
--
-- Adds indexes that become important at scale (thousands of businesses,
-- millions of review_requests). Safe to run on existing data.

-- Speeds up the /resenas page when filtering by status (e.g. "Positivas" tab).
-- The existing idx_review_requests_business covers (business_id, created_at DESC)
-- but adding status allows index-only scans for paginated status queries.
CREATE INDEX IF NOT EXISTS idx_review_requests_business_status
  ON review_requests(business_id, status, created_at DESC);

-- Speeds up the incentive filter on the /resenas page.
-- Allows efficient "WHERE business_id = $1 AND discount_code IS NOT NULL" queries.
CREATE INDEX IF NOT EXISTS idx_review_requests_business_discount
  ON review_requests(business_id, created_at DESC)
  WHERE discount_code IS NOT NULL;

-- Speeds up the daily cron job that fetches all businesses with a Google Maps URL.
-- Without this, the cron does a full table scan on businesses.
CREATE INDEX IF NOT EXISTS idx_businesses_has_google_maps_url
  ON businesses(id)
  WHERE google_maps_url IS NOT NULL;
