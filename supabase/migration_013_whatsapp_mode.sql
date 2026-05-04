-- Migration 013: Modo de envío de WhatsApp por negocio

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS whatsapp_mode TEXT NOT NULL DEFAULT 'shared';

ALTER TABLE businesses
  DROP CONSTRAINT IF EXISTS businesses_whatsapp_mode_check;

ALTER TABLE businesses
  ADD CONSTRAINT businesses_whatsapp_mode_check
  CHECK (whatsapp_mode IN ('shared', 'own', 'dedicated'));

-- Credenciales propias del negocio (solo para modo 'own')
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS own_twilio_account_sid TEXT;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS own_twilio_auth_token TEXT;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS own_twilio_whatsapp_number TEXT;
