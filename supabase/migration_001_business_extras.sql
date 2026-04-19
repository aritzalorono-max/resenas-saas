-- Migration 001: add description, website_url and tone to businesses
-- Run this in Supabase SQL Editor if you already ran schema.sql

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS tone TEXT NOT NULL DEFAULT 'tuteo'
    CHECK (tone IN ('tuteo', 'usted', 'juvenil'));
