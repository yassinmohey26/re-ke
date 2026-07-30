require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. Verify discount.pricingTiers on sample tours
  const {data: tours} = await db.from('tours')
    .select('slug, discount')
    .in('slug', ['private-delfin-tour-hurghada','luxor-tagesausflug-ab-hurghada','kairo-mit-flug-ab-hurghada-pyramiden-museum']);
  console.log('=== Tour discount data ===');
  for (const t of tours) {
    const pts = t.discount?.pricingTiers || [];
    console.log(t.slug + ': ' + pts.length + ' tiers, hasVehicles=' + (pts.some(p => p.vehicle) || false));
  }

  // 2. Get delfin tour id
  const {data: tour} = await db.from('tours').select('id').eq('slug', 'private-delfin-tour-hurghada').single();
  const {data: cts} = await db.from('content_translations')
    .select('locale, description')
    .eq('table_name', 'tours')
    .eq('row_id', tour.id);
  console.log('\n=== CT descriptions (no HTML tables check) ===');
  let allClean = true;
  for (const d of cts) {
    const hasTable = /<table/i.test(d.description);
    const preview = (d.description || '').substring(0, 80).replace(/\n/g, ' ');
    console.log('  ' + d.locale + ': ' + preview + '... [hasTable: ' + hasTable + ']');
    if (hasTable) allClean = false;
  }
  console.log('\nAll CT descriptions clean: ' + allClean);

  // 3. Count tours with pricingTiers
  const {data: all} = await db.from('tours').select('slug, discount');
  const withTiers = all.filter(t => t.discount?.pricingTiers?.length > 0);
  const withTable = all.filter(t => {
    // Check description for remaining tables
    return false; // can't check description text here
  });
  console.log('\nTours with pricingTiers: ' + withTiers.length + '/' + all.length);
  for (const t of withTiers) {
    const pts = t.discount.pricingTiers;
    console.log('  ' + t.slug + ': ' + pts.length + ' tiers');
  }

  // 4. Count tours that still have HTML tables in description
  const {data: descs} = await db.from('tours').select('slug, description');
  const stillHaveTables = descs.filter(d => /<table/i.test(d.description || ''));
  console.log('\nTours with HTML tables remaining in description: ' + stillHaveTables.length + '/' + descs.length);
  if (stillHaveTables.length > 0) {
    for (const d of stillHaveTables) {
      console.log('  REMAINING: ' + d.slug);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
