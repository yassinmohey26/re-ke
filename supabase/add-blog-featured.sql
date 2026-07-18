-- Add featured column to blog_posts
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'featured') THEN
    ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
