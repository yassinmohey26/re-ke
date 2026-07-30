require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug, duration, meeting_point, category_label');
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours');

  // 1. Verify all 5 HU meeting_points are "kb."
  console.log('=== All HU meeting_points ===');
  for (const tour of tours) {
    const hu = cts.find(c => c.row_id === tour.id && c.locale === 'hu');
    if (!hu) continue;
    const { data: fresh } = await db.from('content_translations').select('meeting_point').eq('id', hu.id).single();
    const ok = fresh.meeting_point.includes('kb.') || !tour.meeting_point.includes('ca.');
    console.log(' ' + tour.slug.substring(0,45) + ' | "' + fresh.meeting_point + '"' + (ok ? ' ✅' : ' ⚠️ still German'));
  }

  // 2. Verify 2-day Cairo HU duration
  const cairo = tours.find(t => t.slug === '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben');
  console.log('\n=== 2-day Cairo — all locales duration ===');
  for (const loc of ['en','fr','ru','hu']) {
    const ct = cts.find(c => c.row_id === cairo.id && c.locale === loc);
    if (!ct) continue;
    const { data: fresh } = await db.from('content_translations').select('duration, meeting_point').eq('id', ct.id).single();
    console.log(' ' + loc + ': dur="' + fresh.duration + '" meet="' + fresh.meeting_point + '"');
  }

  // 3. Quick scan: any EN meeting_point or duration still German?
  console.log('\n=== EN — any values still German? ===');
  for (const tour of tours) {
    const en = cts.find(c => c.row_id === tour.id && c.locale === 'en');
    if (!en) continue;
    const { data: fresh } = await db.from('content_translations').select('duration, meeting_point').eq('id', en.id).single();
    if (fresh.duration && (fresh.duration.includes('Stunden') || fresh.duration.includes('Tag') || fresh.duration.includes('Nacht'))) {
      console.log(' DURATION still German: ' + tour.slug.substring(0,40) + ' "' + fresh.duration + '"');
    }
    if (fresh.meeting_point && (fresh.meeting_point.includes('Uhr') || fresh.meeting_point.includes('Rotes Meer') || fresh.meeting_point.includes('Aegypten'))) {
      console.log(' MEET still German: ' + tour.slug.substring(0,40) + ' "' + fresh.meeting_point + '"');
    }
  }
  console.log(' (done — if nothing above, all clean)');
})();
