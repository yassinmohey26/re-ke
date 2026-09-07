-- Admin-managed traveler reviews.
-- Review content is translated inside the translations JSON object.
-- This table is accessed server-side with the Supabase service role.

CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id         UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  guest_name      TEXT NOT NULL CHECK (char_length(trim(guest_name)) > 0),
  guest_country   TEXT NOT NULL DEFAULT '',
  country_code    TEXT NOT NULL DEFAULT ''
                    CHECK (country_code = '' OR country_code ~ '^[A-Z]{2}$'),
  guest_image     TEXT NOT NULL DEFAULT '',
  travel_date     DATE,
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  translations    JSONB NOT NULL DEFAULT '{}'::jsonb
                    CHECK (jsonb_typeof(translations) = 'object'),
  is_verified     BOOLEAN NOT NULL DEFAULT false,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  featured        BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_tour_published
  ON reviews(tour_id, is_published, sort_order, travel_date DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_featured_published
  ON reviews(featured, is_published, sort_order, travel_date DESC)
  WHERE featured = true AND is_published = true;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE reviews IS
  'Admin-managed traveler reviews displayed on tour pages and the homepage.';

COMMENT ON COLUMN reviews.translations IS
  'Localized review content: {"de":{"title":"","body":""},"en":{...}}';
