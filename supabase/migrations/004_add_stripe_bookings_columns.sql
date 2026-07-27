-- Migration: Add missing columns to bookings table for Stripe integration
-- Run: psql "postgresql://..." -f supabase/migrations/004_add_stripe_bookings_columns.sql

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_error TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Index for looking up bookings by Stripe payment ID (used in charge.refunded webhook)
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_id ON bookings (stripe_payment_id);

-- Backfill updated_at for existing rows
UPDATE bookings SET updated_at = created_at WHERE updated_at IS NULL;
