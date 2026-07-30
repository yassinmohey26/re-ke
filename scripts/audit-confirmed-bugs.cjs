require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async()=>{
  // Confirmed bugs: duration is a time/location, or meeting_point is a location instead of time
  const bugSlugs = [
    'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
    'private-delfin-tour-hurghada',
    'private-speedboot-tour-orange-bay-hurghada',
    '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
    'hurghada-shopping-tour-basar-transfer',
  ];
  
  const {data: tours} = await db.from('tours').select('id, slug, duration, meeting_point').in('slug', bugSlugs);
  for (const t of tours || []) {
    console.log('\n=== ' + t.slug + ' ===');
    console.log('BASE_DUR: ' + JSON.stringify(t.duration));
    console.log('BASE_MP: ' + JSON.stringify(t.meeting_point));
    const {data: trs} = await db.from('content_translations')
      .select('id, locale, duration, meeting_point')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .in('locale', ['en', 'fr', 'ru', 'hu', 'ar', 'de']);
    for (const r of trs || []) {
      const flags = [];
      if (r.duration && (r.duration.includes('p.m') || r.duration.includes('a.m') || r.duration === '8h' || r.duration === '')) flags.push('BAD_DUR');
      if (r.meeting_point && (r.meeting_point.includes('Red Sea') || r.meeting_point.includes('Rotes Meer') || r.meeting_point.includes('Красное море') || r.meeting_point.includes('Vörös-tenger') || r.meeting_point.includes('Hotel pickup'))) flags.push('BAD_MP');
      console.log('  [' + r.locale + '] DUR: ' + JSON.stringify(r.duration) + ' | MP: ' + JSON.stringify(r.meeting_point) + (flags.length ? ' ⚠️ ' + flags.join(', ') : ''));
    }
  }
})();
