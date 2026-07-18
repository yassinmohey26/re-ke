-- Airport Transfers pricing table
CREATE TABLE IF NOT EXISTS airport_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT DEFAULT 0,
  destination TEXT NOT NULL,
  car_price NUMERIC,
  minibus_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Airport Transfer FAQ questions
CREATE TABLE IF NOT EXISTS airport_transfer_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT DEFAULT 0,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE airport_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_transfer_faqs ENABLE ROW LEVEL SECURITY;

-- Public read policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read airport_transfers' AND tablename = 'airport_transfers') THEN
    CREATE POLICY "Public read airport_transfers" ON airport_transfers FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read airport_transfer_faqs' AND tablename = 'airport_transfer_faqs') THEN
    CREATE POLICY "Public read airport_transfer_faqs" ON airport_transfer_faqs FOR SELECT USING (true);
  END IF;
END $$;
