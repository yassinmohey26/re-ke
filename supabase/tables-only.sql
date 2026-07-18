-- =========================================================
-- HURGHADA REISEPLANNER — SUPABASE TABLES ONLY
-- No sample data — add everything from the admin dashboard
-- =========================================================
-- 1. Go to https://supabase.com → your project → SQL Editor
-- 2. New query → paste this → Run ▶️
-- =========================================================

CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS destination_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug TEXT NOT NULL REFERENCES destinations(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  UNIQUE(destination_slug, locale)
);

CREATE TABLE IF NOT EXISTS tour_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL REFERENCES tour_categories(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  label TEXT DEFAULT '',
  description TEXT DEFAULT '',
  UNIQUE(category_slug, locale)
);

CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price NUMERIC,
  duration TEXT DEFAULT '',
  duration_hours NUMERIC DEFAULT 0,
  max_guests NUMERIC DEFAULT 8,
  difficulty TEXT DEFAULT 'leicht',
  min_age NUMERIC DEFAULT 6,
  destination TEXT DEFAULT '',
  destination_slug TEXT REFERENCES destinations(slug) ON DELETE SET NULL,
  category TEXT DEFAULT '',
  category_label TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]'::jsonb,
  included JSONB DEFAULT '[]'::jsonb,
  not_included JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  image TEXT DEFAULT '',
  meeting_point TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tour_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_slug TEXT NOT NULL REFERENCES tours(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  category_label TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]'::jsonb,
  included JSONB DEFAULT '[]'::jsonb,
  not_included JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  meeting_point TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  UNIQUE(tour_slug, locale)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image TEXT DEFAULT '',
  category TEXT DEFAULT '',
  date DATE DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  author TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_post_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL REFERENCES blog_posts(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT '',
  read_time TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  UNIQUE(post_slug, locale)
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_slug TEXT DEFAULT '',
  tour_name TEXT DEFAULT '',
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  date DATE,
  guests NUMERIC DEFAULT 1,
  status TEXT DEFAULT 'PENDING',
  total_price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination_slug);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured);
CREATE INDEX IF NOT EXISTS idx_tour_translations_slug ON tour_translations(tour_slug);
CREATE INDEX IF NOT EXISTS idx_destination_translations_slug ON destination_translations(destination_slug);
CREATE INDEX IF NOT EXISTS idx_category_translations_slug ON category_translations(category_slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_slug ON blog_post_translations(post_slug);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read destinations' AND tablename = 'destinations') THEN
    CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read dest_trans' AND tablename = 'destination_translations') THEN
    CREATE POLICY "Public read dest_trans" ON destination_translations FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read categories' AND tablename = 'tour_categories') THEN
    CREATE POLICY "Public read categories" ON tour_categories FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read cat_trans' AND tablename = 'category_translations') THEN
    CREATE POLICY "Public read cat_trans" ON category_translations FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read tours' AND tablename = 'tours') THEN
    CREATE POLICY "Public read tours" ON tours FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read tour_trans' AND tablename = 'tour_translations') THEN
    CREATE POLICY "Public read tour_trans" ON tour_translations FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read blog' AND tablename = 'blog_posts') THEN
    CREATE POLICY "Public read blog" ON blog_posts FOR SELECT USING (published = true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read blog_trans' AND tablename = 'blog_post_translations') THEN
    CREATE POLICY "Public read blog_trans" ON blog_post_translations FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read faqs' AND tablename = 'faqs') THEN
    CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert bookings' AND tablename = 'bookings') THEN
    CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert contacts' AND tablename = 'contact_messages') THEN
    CREATE POLICY "Public insert contacts" ON contact_messages FOR INSERT WITH CHECK (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert newsletter' AND tablename = 'newsletter_subscribers') THEN
    CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- =============================================
-- Admin Users (for login)
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'ADMIN' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- No public policies — only service role can access
