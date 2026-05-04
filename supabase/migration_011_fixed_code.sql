-- Migration 011: Código de descuento fijo (siempre el mismo para todos los clientes)

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS incentive_fixed_code TEXT;

-- Actualizar el CHECK constraint para incluir 'fixed'
ALTER TABLE businesses
  DROP CONSTRAINT IF EXISTS businesses_incentive_code_type_check;

ALTER TABLE businesses
  ADD CONSTRAINT businesses_incentive_code_type_check
  CHECK (incentive_code_type IN ('random', 'pool', 'fixed'));

-- También actualizar discount_codes si tiene constraint de tipo
ALTER TABLE discount_codes
  DROP CONSTRAINT IF EXISTS discount_codes_type_check;

ALTER TABLE discount_codes
  ADD CONSTRAINT discount_codes_type_check
  CHECK (type IN ('random', 'pool', 'fixed'));
