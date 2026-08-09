require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALES = ['en', 'ar', 'ru', 'fr', 'hu'];

(async () => {
  const { data: tours } = await db.from('tours').select('id,slug,name');
  const { data: trs } = await db.from('content_translations').select('row_id,locale,name').eq('table_name', 'tours');
  if (!tours || !trs) return;

  const byId = {}; for (const t of tours) byId[t.id] = t;
  const trMap = {}; for (const tr of trs) (trMap[tr.row_id] = trMap[tr.row_id] || {})[tr.locale] = tr;

  console.log(`Total tours: ${tours.length}\n`);
  console.log('=== ALL TOURS with CT names (non-DE) ===');
  for (const t of tours) {
    const names = [];
    for (const loc of LOCALES) {
      const tr = trMap[t.id]?.[loc];
      if (!tr) { names.push(`${loc}:(MISSING)`); continue; }
      const sameAsBase = tr.name && tr.name.trim() === t.name.trim();
      names.push(`${loc}:${sameAsBase ? '=DE' : (tr.name ? 'OK' : 'EMPTY')}`);
    }
    console.log(`  ${t.slug}\n    base="${t.name}"\n    ${names.join(' | ')}`);
  }
})();
