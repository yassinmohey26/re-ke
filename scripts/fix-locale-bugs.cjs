require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const fixes = [
  // 1. privater-pyramiden-ausflug — EN duration and meeting_point are swapped with location data
  { slug: 'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh', locale: 'en', duration: '18 hours', meeting_point: 'Approx. 02:00 AM' },
  // RU meeting_point is a location instead of pickup time
  { slug: 'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh', locale: 'ru', meeting_point: 'примерно в 02:00' },
  // 2. private-delfin-tour — EN and RU meeting_point are location instead of pickup time
  { slug: 'private-delfin-tour-hurghada', locale: 'en', meeting_point: 'Approx. 08:00 AM' },
  { slug: 'private-delfin-tour-hurghada', locale: 'ru', meeting_point: 'примерно в 08:00' },
  // 3. private-speedboot-tour-orange-bay — EN meeting_point is wrong, RU row is null
  { slug: 'private-speedboot-tour-orange-bay-hurghada', locale: 'en', meeting_point: 'Approx. 08:00 AM' },
  // 4. 2-tages-ausflug-nach-kairo — FR and RU duration is "8h" instead of "2 jours/nuits"
  { slug: '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben', locale: 'fr', duration: '2 jours 1 nuit' },
  { slug: '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben', locale: 'ru', duration: '2 дня 1 ночь' },
  // 5. hurghada-shopping-tour — FR and RU meeting_point is empty, fill with pickup info
  { slug: 'hurghada-shopping-tour-basar-transfer', locale: 'fr', meeting_point: 'Prise en charge à votre hôtel' },
  { slug: 'hurghada-shopping-tour-basar-transfer', locale: 'ru', meeting_point: 'Забор из отеля' },
];

(async()=>{
  // Get all tour IDs
  const slugs = [...new Set(fixes.map(f => f.slug))];
  const {data: tours} = await db.from('tours').select('id, slug').in('slug', slugs);
  const idMap = {};
  for (const t of tours || []) idMap[t.slug] = t.id;

  let updated = 0;
  for (const fix of fixes) {
    const rowId = idMap[fix.slug];
    if (!rowId) { console.log('NOT FOUND: ' + fix.slug); continue; }

    // Build update object with only the fields that have values
    const update = {};
    if (fix.duration !== undefined) update.duration = fix.duration;
    if (fix.meeting_point !== undefined) update.meeting_point = fix.meeting_point;

    const { error } = await db
      .from('content_translations')
      .update(update)
      .eq('table_name', 'tours')
      .eq('row_id', rowId)
      .eq('locale', fix.locale);

    if (error) {
      console.log('FAIL [' + fix.locale + '] ' + fix.slug + ': ' + error.message);
    } else {
      const details = Object.entries(update).map(([k,v]) => k + '=' + JSON.stringify(v)).join(', ');
      console.log('OK [' + fix.locale + '] ' + fix.slug + ' → ' + details);
      updated++;
    }
  }
  console.log('\nDone! ' + updated + ' rows updated.');
  console.log('IMPORTANT: No German (de) content was modified.');
})();
