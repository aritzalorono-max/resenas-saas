-- Reemplaza el boolean reminders_enabled por un contador configurable (0, 1 o 2 recordatorios)
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS reminder_max_count INT NOT NULL DEFAULT 2;

-- Migrar datos existentes: si tenían reminders_enabled=false → 0, si true → 2
UPDATE businesses SET reminder_max_count = CASE WHEN reminders_enabled = false THEN 0 ELSE 2 END
  WHERE reminder_max_count = 2;

-- reminder_max_count debe ser 0, 1 o 2
ALTER TABLE businesses
  DROP CONSTRAINT IF EXISTS businesses_reminder_max_count_check;
ALTER TABLE businesses
  ADD CONSTRAINT businesses_reminder_max_count_check CHECK (reminder_max_count IN (0, 1, 2));
