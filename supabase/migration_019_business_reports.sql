-- Business reports table: stores AI-generated analysis reports per business
CREATE TABLE IF NOT EXISTS business_reports (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id              UUID        NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  generated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  period_start             TIMESTAMPTZ NOT NULL,
  period_end               TIMESTAMPTZ NOT NULL,
  total_analyzed           INT         NOT NULL DEFAULT 0,
  sentiment_summary        JSONB       NOT NULL DEFAULT '{}',
  positive_themes          JSONB       NOT NULL DEFAULT '[]',
  negative_themes          JSONB       NOT NULL DEFAULT '[]',
  improvement_ideas        JSONB       NOT NULL DEFAULT '[]',
  platform_comparison      JSONB       NOT NULL DEFAULT '{}',
  stars_calculator         JSONB       NOT NULL DEFAULT '{}',
  frequency_recommendation JSONB       NOT NULL DEFAULT '{}'
);

ALTER TABLE business_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_select_reports" ON business_reports
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "owners_insert_reports" ON business_reports
  FOR INSERT WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
  );

-- Keep only the 10 most recent reports per business to avoid unbounded growth
CREATE OR REPLACE FUNCTION trim_old_reports()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM business_reports
  WHERE business_id = NEW.business_id
    AND id NOT IN (
      SELECT id FROM business_reports
      WHERE business_id = NEW.business_id
      ORDER BY generated_at DESC
      LIMIT 10
    );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trim_old_reports_after_insert
  AFTER INSERT ON business_reports
  FOR EACH ROW EXECUTE FUNCTION trim_old_reports();

CREATE INDEX IF NOT EXISTS idx_business_reports_business_generated
  ON business_reports (business_id, generated_at DESC);
