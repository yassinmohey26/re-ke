require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  
  await c.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'featured') THEN
        ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT false;
      END IF;
    END $$;
  `);
  
  await c.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);`);
  
  console.log('Migration complete: blog_posts.featured added');
  await c.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
