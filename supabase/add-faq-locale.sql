-- Add locale column to faqs and airport_transfer_faqs tables
-- so FAQ content can be translated per language

-- 1. Add locale column to faqs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faqs' AND column_name = 'locale') THEN
    ALTER TABLE faqs ADD COLUMN locale TEXT NOT NULL DEFAULT 'de';
  END IF;
END $$;

-- Mark existing German rows
UPDATE faqs SET locale = 'de' WHERE locale = 'de';

-- 2. Add locale column to airport_transfer_faqs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'airport_transfer_faqs' AND column_name = 'locale') THEN
    ALTER TABLE airport_transfer_faqs ADD COLUMN locale TEXT NOT NULL DEFAULT 'de';
  END IF;
END $$;

-- Mark existing rows — airport_transfer_faqs currently has English content
UPDATE airport_transfer_faqs SET locale = 'en' WHERE locale = 'de';

-- 3. Create index for efficient locale filtering
CREATE INDEX IF NOT EXISTS idx_faqs_locale ON faqs(locale);
CREATE INDEX IF NOT EXISTS idx_at_faqs_locale ON airport_transfer_faqs(locale);
