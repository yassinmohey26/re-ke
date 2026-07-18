-- Create blog_post_translations table for multi-language blog content
CREATE TABLE IF NOT EXISTS blog_post_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug TEXT NOT NULL REFERENCES blog_posts(slug) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  read_time TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_blog_post_translations_slug ON blog_post_translations(post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_locale ON blog_post_translations(locale);
