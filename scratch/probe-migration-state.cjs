require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const GRAND_AQUARIUM_ID = '80dc4e17-ea30-4511-92be-5e8add77f139';

(async () => {
  // 1. Does the pickup_time_slots column exist?
  const col = await db.from('tours').select('pickup_time_slots').limit(1);
  console.log('=== COLUMN CHECK: pickup_time_slots ===');
  if (col.error) {
    console.log('  ❌ Column missing. PostgREST error:', col.error.message);
  } else {
    console.log('  ✅ Column exists.');
  }

  // 2. Slots populated?
  const all = await db.from('tours').select('id,slug,pickup_time_slots,duration_hours,meeting_point,category_label');
  if (all.error) { console.log('  ❌ tours fetch failed:', all.error.message); return; }
  const withSlots = all.data.filter(t => Array.isArray(t.pickup_time_slots));
  const nonEmpty = withSlots.filter(t => t.pickup_time_slots.length > 0);
  const emptyArr = withSlots.filter(t => t.pickup_time_slots.length === 0);
  console.log(`\n=== TOURS (${all.data.length}) ===`);
  console.log(`  pickup_time_slots present: ${withSlots.length} | non-empty: ${nonEmpty.length} | empty[]: ${emptyArr.length} | NULL/missing: ${all.data.length - withSlots.length}`);
  console.log('  Tours with empty[]:', emptyArr.map(t => t.slug).join(', '));
  console.log('  Tours with NULL slots:', all.data.filter(t => !Array.isArray(t.pickup_time_slots)).map(t => t.slug).join(', '));

  // 3. Grand Aquarium base
  const aq = all.data.find(t => t.id === GRAND_AQUARIUM_ID);
  console.log('\n=== GRAND AQUARIUM (base) ===');
  if (aq) console.log(`  meeting_point="${aq.meeting_point}" | category_label(de)="${aq.category_label}"`);

  // 4. CT state for all tours
  const { data: trs, error: trErr } = await db.from('content_translations')
    .select('row_id,locale,duration,meeting_point,category_label')
    .eq('table_name', 'tours');
  if (trErr) { console.log('  ❌ CT fetch failed:', trErr.message); return; }

  const aqCt = trs.filter(t => t.row_id === GRAND_AQUARIUM_ID);
  console.log('\n=== GRAND AQUARIUM (CT category_label) ===');
  for (const loc of ['en', 'ru', 'fr', 'hu']) {
    const r = aqCt.find(t => t.locale === loc);
    console.log(`  [${loc}] category_label="${r?.category_label ?? '(missing)'}"`);
  }

  // 5. CT meeting_point/duration non-null counts per locale
  console.log('\n=== CT meeting_point/duration scan (en/ru/fr/hu/ar) ===');
  const locales = ['en', 'ru', 'fr', 'hu', 'ar', 'de'];
  for (const loc of locales) {
    const rows = trs.filter(t => t.locale === loc);
    const mpNotNull = rows.filter(t => t.meeting_point).length;
    const mpHasTime = rows.filter(t => t.meeting_point && /(\d{1,2}):(\d{2})/.test(t.meeting_point)).length;
    const mpHasTemplate = rows.filter(t => t.meeting_point && t.meeting_point.includes('{time}')).length;
    const durNotNull = rows.filter(t => t.duration).length;
    console.log(`  [${loc}] rows=${rows.length} | meeting_point set=${mpNotNull} | with literal time=${mpHasTime} | with {time}=${mpHasTemplate} | duration set=${durNotNull}`);
  }

  // 6. Sample actual CT rows for family-safari + 2-tages (fr/ru)
  const fam = all.data.find(t => t.slug === 'family-safari-hurghada');
  const cairo = all.data.find(t => t.slug === '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben');
  console.log('\n=== SAMPLES ===');
  for (const t of [fam, cairo].filter(Boolean)) {
    const rows = trs.filter(r => r.row_id === t.id);
    for (const loc of ['fr', 'ru', 'en']) {
      const r = rows.find(x => x.locale === loc);
      console.log(`  ${t.slug}[${loc}] duration=${r?.duration ?? 'null'} meeting="${r?.meeting_point ?? '(null)'}"`);
    }
    console.log(`  ${t.slug} slots=${JSON.stringify(t.pickup_time_slots)} base_meeting="${t.meeting_point}" hours=${t.duration_hours}`);
  }
})();
