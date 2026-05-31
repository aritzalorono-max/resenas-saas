ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS whatsapp_language TEXT NOT NULL DEFAULT 'es'
    CHECK (whatsapp_language IN ('es','en','fr','de','it','pt'));
