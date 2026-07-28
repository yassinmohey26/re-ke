-- Add discount JSONB column to tours table for sale/discount functionality
ALTER TABLE tours ADD COLUMN IF NOT EXISTS discount JSONB DEFAULT '{}'::jsonb;
