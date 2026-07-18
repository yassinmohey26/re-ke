-- =========================================================
-- Hurghada Reiseplaner — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables
-- =========================================================

-- Destinations
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Destination Translations
CREATE TABLE IF NOT EXISTS destination_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug TEXT NOT NULL REFERENCES destinations(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  UNIQUE(destination_slug, locale)
);

-- Tour Categories
CREATE TABLE IF NOT EXISTS tour_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Category Translations
CREATE TABLE IF NOT EXISTS category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL REFERENCES tour_categories(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  label TEXT DEFAULT '',
  description TEXT DEFAULT '',
  UNIQUE(category_slug, locale)
);

-- Tours
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tour Translations
CREATE TABLE IF NOT EXISTS tour_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_slug TEXT NOT NULL REFERENCES tours(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  category_label TEXT DEFAULT '',
  UNIQUE(tour_slug, locale)
);

-- Blog Posts
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

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings
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

-- Contact Messages
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

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Users (keep existing Prisma-managed table or use this)
-- This table is managed by Prisma — do not create here if using Prisma

-- =========================================================
-- Indexes for performance
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination_slug);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- =========================================================
-- Row Level Security (RLS) — enable for production
-- =========================================================
-- ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read policies (for the website)
-- CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
-- CREATE POLICY "Public read tours" ON tours FOR SELECT USING (true);
-- CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (published = true);
-- CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
-- CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public insert contacts" ON contact_messages FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public insert subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
