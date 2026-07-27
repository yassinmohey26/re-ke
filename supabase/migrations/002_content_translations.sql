-- Run this ONCE in the Supabase SQL Editor.
-- Replaces the per-row locale approach with a proper translations table.

-- 1. Create the translations table
CREATE TABLE IF NOT EXISTS content_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,          -- 'tours', 'destinations', 'blog_posts', 'faqs'
  row_id UUID NOT NULL,              -- FK to the source row
  locale TEXT NOT NULL,              -- 'de', 'en', 'ru', 'ar', 'fr', 'hu'
  name TEXT,
  short_description TEXT,
  description TEXT,
  category_label TEXT,
  highlights JSONB,
  included JSONB,
  not_included JSONB,
  itinerary JSONB,
  faqs JSONB,
  meeting_point TEXT,
  duration TEXT,
  tagline TEXT,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  read_time TEXT,
  tags JSONB,
  question TEXT,
  answer TEXT,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(table_name, row_id, locale)
);

-- 2. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_ct_table_row ON content_translations(table_name, row_id);
CREATE INDEX IF NOT EXISTS idx_ct_locale ON content_translations(locale);

-- 3. Migrate existing locale data from tours table into translations
INSERT INTO content_translations (table_name, row_id, locale, name, short_description, description, category_label, highlights, included, not_included, itinerary, faqs, meeting_point, duration)
SELECT 'tours', id, COALESCE(locale, 'de'), name, short_description, description, category_label, highlights, included, not_included, itinerary, faqs, meeting_point, duration
FROM tours
WHERE locale IS NOT NULL AND locale != 'de'
ON CONFLICT (table_name, row_id, locale) DO NOTHING;

-- 4. Migrate existing locale data from destinations table
INSERT INTO content_translations (table_name, row_id, locale, name, tagline, description)
SELECT 'destinations', id, COALESCE(locale, 'de'), name, tagline, description
FROM destinations
WHERE locale IS NOT NULL AND locale != 'de'
ON CONFLICT (table_name, row_id, locale) DO NOTHING;

-- 5. Migrate existing locale data from blog_posts table
INSERT INTO content_translations (table_name, row_id, locale, title, excerpt, content, category, read_time, tags)
SELECT 'blog_posts', id, COALESCE(locale, 'de'), title, excerpt, content, category, read_time, tags
FROM blog_posts
WHERE locale IS NOT NULL AND locale != 'de'
ON CONFLICT (table_name, row_id, locale) DO NOTHING;

-- 6. Always create a 'de' translation row for every existing content row
-- so the data layer always has a DE fallback in the translations table.
INSERT INTO content_translations (table_name, row_id, locale, name, short_description, description, category_label, highlights, included, not_included, itinerary, faqs, meeting_point, duration)
SELECT 'tours', id, 'de', name, short_description, description, category_label, highlights, included, not_included, itinerary, faqs, meeting_point, duration
FROM tours
ON CONFLICT (table_name, row_id, locale) DO NOTHING;

INSERT INTO content_translations (table_name, row_id, locale, name, tagline, description)
SELECT 'destinations', id, 'de', name, tagline, description
FROM destinations
ON CONFLICT (table_name, row_id, locale) DO NOTHING;

INSERT INTO content_translations (table_name, row_id, locale, title, excerpt, content, category, read_time, tags)
SELECT 'blog_posts', id, 'de', title, excerpt, content, category, read_time, tags
FROM blog_posts
ON CONFLICT (table_name, row_id, locale) DO NOTHING;

INSERT INTO content_translations (table_name, row_id, locale, question, answer, sort_order)
SELECT 'faqs', id, 'de', question, answer, sort_order
FROM faqs
ON CONFLICT (table_name, row_id, locale) DO NOTHING;

-- 7. Migrate non-de FAQ translations
INSERT INTO content_translations (table_name, row_id, locale, question, answer, sort_order)
SELECT 'faqs', id, COALESCE(locale, 'de'), question, answer, sort_order
FROM faqs
WHERE locale IS NOT NULL AND locale != 'de'
ON CONFLICT (table_name, row_id, locale) DO NOTHING;

-- 8. Drop the locale columns from content tables (no longer needed)
ALTER TABLE tours DROP COLUMN IF EXISTS locale;
ALTER TABLE destinations DROP COLUMN IF EXISTS locale;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS locale;
ALTER TABLE faqs DROP COLUMN IF EXISTS locale;

-- 9. Drop old unique constraints and indexes
DROP INDEX IF EXISTS idx_tours_slug_locale;
DROP INDEX IF EXISTS idx_destinations_slug_locale;
DROP INDEX IF EXISTS idx_blog_posts_slug_locale;
DROP INDEX IF EXISTS idx_tours_locale;
DROP INDEX IF EXISTS idx_destinations_locale;
DROP INDEX IF EXISTS idx_blog_posts_locale;
DROP INDEX IF EXISTS idx_faqs_locale;
