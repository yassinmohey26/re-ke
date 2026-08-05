-- Child age/pricing tiers per tour (locale-neutral; labels rendered via i18n)

DO $$ BEGIN
  CREATE TYPE child_discount_type AS ENUM (
    'free',
    'percentage',
    'full_price',
    'fixed_price'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS tour_child_discounts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id        UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  age_from       INTEGER NOT NULL CHECK (age_from >= 0),
  age_to         INTEGER CHECK (age_to IS NULL OR age_to >= age_from),
  discount_type  child_discount_type NOT NULL,
  discount_value NUMERIC CHECK (discount_value IS NULL OR discount_value >= 0),
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tour_child_discounts_tour
  ON tour_child_discounts(tour_id, sort_order);
