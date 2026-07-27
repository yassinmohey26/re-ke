-- Run this ONCE in the Supabase SQL Editor dashboard.
-- It adds a `locale` column to all content tables so each row
-- can store its own language version. Existing rows default to 'de'.

ALTER TABLE tours ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'de';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'de';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'de';
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'de';

-- Unique indexes so you can't have duplicate slugs per locale
CREATE UNIQUE INDEX IF NOT EXISTS idx_tours_slug_locale ON tours(slug, locale);
CREATE UNIQUE INDEX IF NOT EXISTS idx_destinations_slug_locale ON destinations(slug, locale);
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug_locale ON blog_posts(slug, locale);

-- Index for fast locale lookups
CREATE INDEX IF NOT EXISTS idx_tours_locale ON tours(locale);
CREATE INDEX IF NOT EXISTS idx_destinations_locale ON destinations(locale);
CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(locale);
CREATE INDEX IF NOT EXISTS idx_faqs_locale ON faqs(locale);
