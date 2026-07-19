/**
 * Run SQL migration via Supabase's built-in SQL endpoint.
 * 
 * This script must be run AFTER the exec_sql function is created in Supabase.
 *
 * Run in PowerShell:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="your-key"; node scripts/run-migration.js
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bgweumxabgkkqnvifaik.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const statements = [
  "DROP TABLE IF EXISTS tour_translations CASCADE",
  "DROP TABLE IF EXISTS blog_post_translations CASCADE",
  "DROP TABLE IF EXISTS destination_translations CASCADE",
  "DROP TABLE IF EXISTS category_translations CASCADE",
];

async function run() {
  for (const sql of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.log('ERROR:', sql.substring(0, 60), '->', error.message);
    } else {
      console.log('OK:', sql.substring(0, 60));
    }
  }
}

run();
