-- ReseñasYa - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Businesses table (one per authenticated user)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  google_maps_url TEXT,
  welcome_message TEXT DEFAULT '¡Hola {nombre}! Soy el equipo de {negocio}. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊',
  tone TEXT NOT NULL DEFAULT 'tuteo' CHECK (tone IN ('tuteo', 'usted', 'juvenil')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Review requests table
CREATE TABLE IF NOT EXISTS review_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'positive', 'negative', 'neutral', 'no_response')),
  customer_response TEXT,
  sentiment_score FLOAT,
  twilio_message_sid TEXT,
  follow_up_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- Index for fast lookup by phone when webhook fires
CREATE INDEX IF NOT EXISTS idx_review_requests_phone
  ON review_requests(customer_phone, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_review_requests_business
  ON review_requests(business_id, created_at DESC);

-- Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;

-- Businesses: users can only see/edit their own business
CREATE POLICY "businesses_owner_all" ON businesses
  FOR ALL USING (auth.uid() = user_id);

-- Review requests: users can only see requests from their business
CREATE POLICY "review_requests_owner_all" ON review_requests
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- View for dashboard stats
CREATE OR REPLACE VIEW business_stats AS
SELECT
  b.id AS business_id,
  b.user_id,
  COUNT(rr.id) AS total_requests,
  COUNT(CASE WHEN rr.status = 'positive' THEN 1 END) AS positive_count,
  COUNT(CASE WHEN rr.status = 'negative' THEN 1 END) AS negative_count,
  COUNT(CASE WHEN rr.status = 'neutral' THEN 1 END) AS neutral_count,
  COUNT(CASE WHEN rr.status = 'pending' THEN 1 END) AS pending_count,
  COUNT(CASE WHEN rr.status = 'no_response' THEN 1 END) AS no_response_count,
  ROUND(
    CASE
      WHEN COUNT(CASE WHEN rr.status IN ('positive','negative','neutral') THEN 1 END) > 0
      THEN COUNT(CASE WHEN rr.status = 'positive' THEN 1 END)::NUMERIC * 100 /
           COUNT(CASE WHEN rr.status IN ('positive','negative','neutral') THEN 1 END)
      ELSE 0
    END, 1
  ) AS positive_rate
FROM businesses b
LEFT JOIN review_requests rr ON rr.business_id = b.id
GROUP BY b.id, b.user_id;
