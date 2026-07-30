require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: tours } = await db.from('tours').select('id,slug,updated_at').eq('active', true);
  const { data: cts } = await db.from('content_translations')
    .select('row_id,updated_at')
    .eq('table_name','tours')
    .eq('locale','de');

  console.log('=== Updated_at comparison for 4 divergent tours ===\n');
  const slugs = [
    'kairo-mit-flug-ab-hurghada-pyramiden-museum',
    '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
    'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
    'luxor-tagesausflug-heissluftballon-hoteluebernachtung'
  ];

  for (const slug of slugs) {
    const t = tours.find(t => t.slug === slug);
    if (!t) { console.log(slug.substring(0,50)+': NOT FOUND'); continue; }
    const ct = cts.find(c => c.row_id === t.id);
    console.log('Tour: ' + t.slug.substring(0,55));
    console.log('  tours.description updated:       ' + t.updated_at);
    console.log('  content_translations[de] updated: ' + (ct ? ct.updated_at : 'N/A'));
    console.log('');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
