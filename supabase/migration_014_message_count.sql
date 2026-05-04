-- Migration 014: Contador de mensajes por solicitud de reseña
-- Permite limitar la conversación a un máximo de 7 mensajes por cliente

ALTER TABLE review_requests
  ADD COLUMN IF NOT EXISTS message_count INTEGER NOT NULL DEFAULT 0;
