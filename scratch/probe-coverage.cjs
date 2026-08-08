require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours } = await db.from('tours').select('id,slug,category_label');
  const { data: trs } = await db.from('content_translations').select('row_id,locale,meeting_point,duration').eq('table_name','tours');
  if (!tours || !trs) return;

  const byId = {}; for (const t of tours) byId[t.id] = t;
  const cov = {};
  for (const tr of trs) { (cov[tr.row_id] = cov[tr.row_id] || []).push(tr.locale); }

  console.log('=== CT COVERAGE PER TOUR (locales present) ===');
  for (const t of tours) {
    const locs = (cov[t.id] || []).join(',');
    const missing = ['en','ru','fr','hu','ar','de'].filter(l => !(cov[t.id]||[]).includes(l));
    console.log(`  ${t.slug}  [${locs}]${missing.length?`  MISSING: ${missing.join(',')}`:''}`);
  }

  console.log('\n=== DE BASE category_label values (by category) ===');
  const byCat = {};
  for (const t of tours) (byCat[t.category] = byCat[t.category] || []).push(t.category_label);
  for (const c of Object.keys(byCat)) console.log(`  ${c}: ${[...new Set(byCat[c])].join(' | ')}`);

  console.log('\n=== family-abendsafari CT rows (all fields present?) ===');
  const fam = tours.find(t=>t.slug==='family-abendsafari-hurghada');
  const famTrs = trs.filter(t=>t.row_id===fam.id);
  for (const tr of famTrs) console.log(`  [${tr.locale}] duration=${JSON.stringify(tr.duration)} meeting=${JSON.stringify(tr.meeting_point)}`);
  console.log(`  total CT rows: ${famTrs.length}`);
})();
