-- migration_023: Recordatorios automáticos para solicitudes sin respuesta
--
-- Añade soporte para enviar hasta 2 recordatorios a clientes que no respondieron.
-- Cada recordatorio cuenta como un nuevo envío a efectos de facturación.

-- Columnas en review_requests para rastrear recordatorios enviados
ALTER TABLE review_requests
  ADD COLUMN IF NOT EXISTS reminder_count    INT          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_reminder_at  TIMESTAMPTZ;

-- Toggle en businesses para activar/desactivar recordatorios
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN NOT NULL DEFAULT true;

-- Índice para que el cron encuentre rápido las solicitudes que necesitan recordatorio
CREATE INDEX IF NOT EXISTS idx_review_requests_pending_reminders
  ON review_requests(status, created_at, reminder_count)
  WHERE status = 'pending';
