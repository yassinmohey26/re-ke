require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function parseItin(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const p = JSON.parse(val); if (Array.isArray(p)) return p; } catch {} }
  return null;
}

(async () => {
  const { data: tours } = await db.from('tours')
    .select('id, slug, itinerary')
    .in('slug', ['family-abendsafari-hurghada', 'reiten-in-hurghada-strand-wueste-pferde-im-meer']);
  for (const t of tours || []) {
    console.log(`=== ${t.slug} (tour id=${t.id})`);
    console.log('DE itin:', JSON.stringify(parseItin(t.itinerary), null, 1));
    const { data: rows } = await db.from('content_translations')
      .select('id, locale, itinerary, content')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .in('locale', ['fr', 'hu']);
    for (const r of rows || []) {
      console.log(`--- ${r.locale} row id=${r.id}`);
      console.log('  itinerary col:', JSON.stringify(parseItin(r.itinerary)));
      console.log('  content col:', JSON.stringify(parseItin(r.content)));
    }
  }
})();
