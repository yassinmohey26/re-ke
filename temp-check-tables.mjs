import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Try common table names
const tables = ['tours', 'destinations', 'blog_posts', 'faqs', 'bookings', 'contacts', 'newsletter_subscribers'];
for (const t of tables) {
  const { data, error } = await db.from(t).select('*').limit(1);
  console.log(`${t}: ${error ? 'NO (' + error.message + ')' : 'YES (cols: ' + Object.keys((data && data[0]) || {}).join(', ') + ')'}`);
}

// Try to create content_translations via the SQL endpoint
console.log('\nTrying to create content_translations table via REST SQL...');
const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  },
  body: JSON.stringify({
    query: `CREATE TABLE IF NOT EXISTS content_translations (
      id BIGSERIAL PRIMARY KEY,
      content_hash TEXT NOT NULL,
      locale TEXT NOT NULL,
      field TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(content_hash, locale, field)
    );
    CREATE INDEX IF NOT EXISTS idx_ct_hash_locale ON content_translations(content_hash, locale);`
  })
});
console.log('SQL endpoint status:', res.status, await res.text());
