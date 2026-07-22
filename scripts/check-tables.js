const fs = require('fs');
const path = require('path');
const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(l => {
  const i = l.indexOf('=');
  if (i > 0 && !l.startsWith('#')) {
    env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  }
});
const { createClient } = require('@supabase/supabase-js');
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const { data, error } = await db.from('tours').select('name, slug, description').order('name');
  if (error) { console.error(error); return; }
  const withTables = (data || []).filter(t => t.description && t.description.includes('<table'));
  console.log('Tours with tables (' + withTables.length + '):');
  withTables.forEach(t => console.log('- ' + t.name + '  [' + t.slug + ']'));
})();
