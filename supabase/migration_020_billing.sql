-- Datos de facturación del negocio
CREATE TABLE IF NOT EXISTS billing_info (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo         TEXT        NOT NULL DEFAULT 'particular' CHECK (tipo IN ('particular', 'empresa')),
  nombre       TEXT        NOT NULL DEFAULT '',
  nif          TEXT        NOT NULL DEFAULT '',
  direccion    TEXT        NOT NULL DEFAULT '',
  ciudad       TEXT        NOT NULL DEFAULT '',
  codigo_postal TEXT       NOT NULL DEFAULT '',
  pais         TEXT        NOT NULL DEFAULT 'España',
  email_facturacion TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "billing_info_owner" ON billing_info
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Historial de pagos (se rellenará al integrar un procesador de pagos como Stripe)
CREATE TABLE IF NOT EXISTS payments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount       INTEGER     NOT NULL,   -- en céntimos (ej: 2900 = 29,00 €)
  currency     TEXT        NOT NULL DEFAULT 'eur',
  plan         TEXT        NOT NULL DEFAULT 'pro',
  status       TEXT        NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  description  TEXT,
  invoice_url  TEXT,
  period_start TIMESTAMPTZ,
  period_end   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_owner" ON payments
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_payments_user_date ON payments (user_id, created_at DESC);
