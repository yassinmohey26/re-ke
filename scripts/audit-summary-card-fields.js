require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // difficulty values in DE source
  const { data: diffs } = await db.from('tours').select('difficulty');
  const unique = [...new Set(diffs.map(d => d.difficulty).filter(Boolean))];
  console.log('=== difficulty values (DE tours table) ===');
  console.log(unique.join(', '));

  // content_translations columns
  const { data: ctSample } = await db.from('content_translations').select('*').limit(1).single();
  console.log('\n=== content_translations columns ===');
  console.log(Object.keys(ctSample).join(', '));

  // Full content_translations
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours');
  const { data: tours } = await db.from('tours').select('id, slug, difficulty, short_description, description, duration, meeting_point');

  // category_label by locale
  const cats = {};
  cts.forEach(c => {
    if (!cats[c.locale]) cats[c.locale] = new Set();
    if (c.category_label) cats[c.locale].add(c.category_label);
  });
  console.log('\n=== category_label by locale ===');
  for (const [loc, vals] of Object.entries(cats)) {
    console.log(' ' + loc + ': ' + [...vals].join(' | '));
  }

  // EN short_description and description
  const enCts = cts.filter(c => c.locale === 'en');
  let shortDe = 0, descDe = 0;
  for (const tour of tours) {
    const en = enCts.find(c => c.row_id === tour.id);
    if (!en) continue;
    if (en.short_description && en.short_description === tour.short_description) shortDe++;
    if (en.description && en.description === tour.description) descDe++;
  }
  console.log('\n=== EN short_description & description audit ===');
  console.log(' short_description still German: ' + shortDe + '/26');
  console.log(' description still German: ' + descDe + '/26');

  // EN duration
  console.log('\n=== ALL 26 EN duration values ===');
  for (const tour of tours) {
    const en = enCts.find(c => c.row_id === tour.id);
    console.log(' ' + tour.slug.substring(0,45) + ' | "' + (en?.duration || tour.duration) + '"');
  }

  // EN meeting_point
  console.log('\n=== ALL 26 EN meeting_point values ===');
  for (const tour of tours) {
    const en = enCts.find(c => c.row_id === tour.id);
    console.log(' ' + tour.slug.substring(0,45) + ' | "' + (en?.meeting_point || tour.meeting_point) + '"');
  }

  // Per-locale: which locales still have German meeting_point?
  console.log('\n=== meeting_point: per-locale German count ===');
  const locales = ['en','ar','ru','fr','hu'];
  for (const loc of locales) {
    let count = 0;
    const locCts = cts.filter(c => c.locale === loc);
    for (const tour of tours) {
      const ct = locCts.find(c => c.row_id === tour.id);
      if (ct && tour.meeting_point && ct.meeting_point === tour.meeting_point) count++;
    }
    console.log(' ' + loc + ': ' + count + '/26 meeting_point still matches German');
  }

  // Per-locale: duration
  console.log('\n=== duration: per-locale German count ===');
  for (const loc of locales) {
    let count = 0;
    const locCts = cts.filter(c => c.locale === loc);
    for (const tour of tours) {
      const ct = locCts.find(c => c.row_id === tour.id);
      if (ct && tour.duration && ct.duration === tour.duration) count++;
    }
    console.log(' ' + loc + ': ' + count + '/26 duration still matches German');
  }
})();
