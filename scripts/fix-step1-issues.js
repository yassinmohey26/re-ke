require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug, duration, meeting_point');
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours');

  // Issue 1: Orange Bay HU meeting_point
  const orangeBay = tours.find(t => t.slug === 'orange-bay-insel-schnorchelausflug-hurghada');
  const huOrange = cts.find(c => c.row_id === orangeBay.id && c.locale === 'hu');
  console.log('=== Issue 1: Orange Bay HU meeting_point ===');
  console.log('DE source:  "' + orangeBay.meeting_point + '"');
  console.log('HU current: "' + huOrange.meeting_point + '"');
  console.log('Match check: ct.meeting_point === tour.meeting_point -> ' + (huOrange.meeting_point === orangeBay.meeting_point));
  console.log('This is a pre-existing partial translation (DE "Uhr" removed but "ca." not translated to "kb."). Fixing...');
  await db.from('content_translations').update({ meeting_point: 'kb. 08:00' }).eq('id', huOrange.id);
  console.log('Fixed: "ca. 08:00" -> "kb. 08:00"');

  // Verify all 4 HU meeting_points
  console.log('\n=== HU meeting_point — verify all 4 ===');
  const huMeetingTours = ['kairo-mit-flug-ab-hurghada-pyramiden-museum', 'kloester-st-antonius-st-paulus', 'glasbodenboot-hurghada-mit-schnorcheln', 'orange-bay-insel-schnorchelausflug-hurghada', 'hula-hula-insel-schnorchelausflug-hurghada'];
  for (const slug of huMeetingTours) {
    const tour = tours.find(t => t.slug === slug);
    const ct = cts.find(c => c.row_id === tour.id && c.locale === 'hu');
    const { data: fresh } = await db.from('content_translations').select('meeting_point').eq('id', ct.id).single();
    console.log(' ' + slug.substring(0,45) + ' | DE: "' + tour.meeting_point + '" | HU: "' + fresh.meeting_point + '"' + (fresh.meeting_point.includes('kb.') ? ' ✅' : ' ⚠️'));
  }

  // Issue 2: 2-day Cairo HU duration
  const cairo2 = tours.find(t => t.slug === '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben');
  const huCairo = cts.find(c => c.row_id === cairo2.id && c.locale === 'hu');
  console.log('\n=== Issue 2: 2-day Cairo HU duration ===');
  console.log('DE source:  "' + cairo2.duration + '"');
  console.log('HU current: "' + huCairo.duration + '"');

  // Check all HU durations to see if this is an anomaly
  console.log('\n=== All HU durations ===');
  for (const tour of tours) {
    const hu = cts.find(c => c.row_id === tour.id && c.locale === 'hu');
    if (!hu) continue;
    const { data: fresh } = await db.from('content_translations').select('duration').eq('id', hu.id).single();
    const match = fresh.duration === cairo2.duration ? '(same as DE)' : '';
    const mismatch = fresh.duration !== tour.duration ? 'different from DE' : '=DE';
    console.log(' ' + tour.slug.substring(0,45) + ' | DE: "' + tour.duration + '" | HU: "' + fresh.duration + '" [' + mismatch + ']');
  }

  // Check what EN, FR, RU show for 2-day Cairo
  for (const loc of ['en', 'fr', 'ru']) {
    const ct = cts.find(c => c.row_id === cairo2.id && c.locale === loc);
    const { data: fresh } = await db.from('content_translations').select('duration').eq('id', ct.id).single();
    console.log(' ' + loc + ': "' + fresh.duration + '"');
  }
})();
