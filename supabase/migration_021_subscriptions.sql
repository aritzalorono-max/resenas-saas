-- Campos de suscripción Stripe en la tabla businesses
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS stripe_customer_id      TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id  TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status     TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_status IN ('free', 'trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  ADD COLUMN IF NOT EXISTS subscription_plan       TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_plan IN ('free', 'starter', 'pro')),
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_businesses_stripe_customer   ON businesses (stripe_customer_id)   WHERE stripe_customer_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_businesses_stripe_sub        ON businesses (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
