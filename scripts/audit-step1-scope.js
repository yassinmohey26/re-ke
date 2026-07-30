require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug, duration, meeting_point, category_label');
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours');

  const locales = ['en', 'ru', 'fr', 'hu'];

  // DURATION: show what DE has and what EN has
  console.log('=== DURATION — DE source vs EN current ===');
  for (const tour of tours) {
    const en = cts.find(c => c.row_id === tour.id && c.locale === 'en');
    console.log(' ' + tour.slug.substring(0,45) + ' | DE: "' + tour.duration + '" | EN: "' + (en?.duration || '') + '"');
  }

  // MEETING_POINT: per-tour, which locales have it still matching DE
  console.log('\n=== MEETING_POINT — tours still German by locale ===');
  const meetingNeeds = {};
  for (const loc of locales) {
    meetingNeeds[loc] = [];
    for (const tour of tours) {
      const ct = cts.find(c => c.row_id === tour.id && c.locale === loc);
      if (ct && tour.meeting_point && ct.meeting_point === tour.meeting_point) {
        meetingNeeds[loc].push(tour.slug.substring(0,40) + ' | "' + tour.meeting_point + '"');
      }
    }
    console.log(' ' + loc + ' (' + meetingNeeds[loc].length + '):');
    meetingNeeds[loc].forEach(s => console.log('   ' + s));
  }

  // CATEGORY_LABEL: EN values that are still German
  console.log('\n=== CATEGORY_LABEL — EN values still German ===');
  const deCategories = [...new Set(tours.map(t => t.category_label).filter(Boolean))];
  console.log(' DE source categories: ' + deCategories.join(', '));
  const enCats = {};
  for (const tour of tours) {
    const en = cts.find(c => c.row_id === tour.id && c.locale === 'en');
    if (en?.category_label) {
      if (!enCats[en.category_label]) enCats[en.category_label] = [];
      enCats[en.category_label].push(tour.slug.substring(0,30));
    }
  }
  console.log(' EN values in content_translations:');
  for (const [val, slugs] of Object.entries(enCats)) {
    const isGerman = deCategories.includes(val);
    console.log('  ' + (isGerman ? '❌ GERMAN' : '✅ ENGLISH') + ': "' + val + '" (' + slugs.join(', ') + ')');
  }

  // Also check AR/RU/FR/HU category_label for German values
  console.log('\n=== CATEGORY_LABEL — other locales ===');
  for (const loc of ['ar','ru','fr','hu']) {
    const germanCats = [];
    for (const tour of tours) {
      const ct = cts.find(c => c.row_id === tour.id && c.locale === loc);
      if (ct?.category_label && deCategories.includes(ct.category_label)) {
        germanCats.push(tour.slug.substring(0,30) + ': "' + ct.category_label + '"');
      }
    }
    console.log(' ' + loc + ': ' + germanCats.length + ' still German');
    germanCats.forEach(s => console.log('   ' + s));
  }
})();
