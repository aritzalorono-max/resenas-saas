-- Migration 012: Cuándo comunicar el incentivo al cliente

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS incentive_timing TEXT NOT NULL DEFAULT 'initial';

ALTER TABLE businesses
  DROP CONSTRAINT IF EXISTS businesses_incentive_timing_check;

ALTER TABLE businesses
  ADD CONSTRAINT businesses_incentive_timing_check
  CHECK (incentive_timing IN ('initial', 'after_positive'));
