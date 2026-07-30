require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Translation maps
const durationEN = s => s
  .replace('Stunden', 'Hours')
  .replace('Tage', 'Days')
  .replace('Tag', 'Day')
  .replace('Nacht', 'Night');

const meetingTranslations = {
  en: s => s
    .replace('ca. ', 'approx. ')
    .replace('ca.', 'approx.')
    .replace('Uhr', '')
    .replace('Rotes Meer', 'Red Sea')
    .replace('Aegypten', 'Egypt')
    .replace(/\s+$/, ''),
  fr: s => s
    .replace('ca. ', 'env. ')
    .replace('ca.', 'env.')
    .replace('Uhr', '')
    .replace('Rotes Meer', 'Mer Rouge')
    .replace('Aegypten', 'Égypte')
    .replace(/\s+$/, ''),
  ru: s => s
    .replace('ca. ', 'ок. ')
    .replace('ca.', 'ок.')
    .replace('Uhr', '')
    .replace('Hurghada', 'Хургада')
    .replace('Rotes Meer', 'Красное море')
    .replace('Aegypten', 'Египет')
    .replace(/\s+$/, ''),
  hu: s => s
    .replace('ca. ', 'kb. ')
    .replace('ca.', 'kb.')
    .replace('Uhr', '')
    .replace('Rotes Meer', 'Vörös-tenger')
    .replace('Aegypten', 'Egyiptom')
    .replace(/\s+$/, '')
};

const categoryEN = {
  'Kultur Ausflüge': 'Cultural Excursions',
  'Schnorchel Touren': 'Snorkel Tours',
  'Safari Ausflüge': 'Safari Tours',
  'Schnorcheln & Tauchen': 'Snorkeling & Diving'
};
const categoryFR = {
  'Kultur Ausflüge': 'Excursions culturelles',
  'Schnorchel Touren': 'Excursions de snorkeling',
  'Safari Ausflüge': 'Excursions safari',
  'Schnorcheln & Tauchen': 'Excursions de plongée'
};
const categoryHU = {
  'Kultur Ausflüge': 'Kulturális kirándulások',
  'Schnorchel Touren': 'Snorkel túrák',
  'Safari Ausflüge': 'Safari kirándulások',
  'Schnorcheln & Tauchen': 'Búvárkodás & sznorkelezés'
};

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug, duration, meeting_point, category_label');
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours');

  let changes = [];

  // 1. DURATION — EN only (only if current value still = DE source)
  for (const tour of tours) {
    const en = cts.find(c => c.row_id === tour.id && c.locale === 'en');
    if (!en) continue;
    if (en.duration !== tour.duration) continue; // already translated
    const newDur = durationEN(tour.duration);
    if (newDur !== en.duration) {
      changes.push({ table: 'content_translations', id: en.id, field: 'duration', locale: 'en', slug: tour.slug.substring(0,40), old: en.duration, new: newDur });
    }
  }

  // 2. MEETING_POINT — all locales (only if current value still = DE source)
  for (const loc of ['en','fr','ru','hu']) {
    const fn = meetingTranslations[loc];
    for (const tour of tours) {
      const ct = cts.find(c => c.row_id === tour.id && c.locale === loc);
      if (!ct) continue;
      // Only update if current value is still German (equals DE source)
      if (ct.meeting_point !== tour.meeting_point) continue;
      const newMeet = fn(tour.meeting_point || '');
      if (newMeet !== ct.meeting_point && newMeet !== '') {
        changes.push({ table: 'content_translations', id: ct.id, field: 'meeting_point', locale: loc, slug: tour.slug.substring(0,40), old: ct.meeting_point, new: newMeet });
      }
    }
  }

  // 3. CATEGORY_LABEL — EN, FR, HU
  for (const tour of tours) {
    const deCat = tour.category_label;
    if (!deCat) continue;
    
    // EN
    if (categoryEN[deCat]) {
      const en = cts.find(c => c.row_id === tour.id && c.locale === 'en');
      if (en && en.category_label !== categoryEN[deCat] && en.category_label === deCat) {
        changes.push({ table: 'content_translations', id: en.id, field: 'category_label', locale: 'en', slug: tour.slug.substring(0,40), old: en.category_label, new: categoryEN[deCat] });
      }
    }
    // FR
    if (categoryFR[deCat]) {
      const fr = cts.find(c => c.row_id === tour.id && c.locale === 'fr');
      if (fr && fr.category_label !== categoryFR[deCat] && fr.category_label === deCat) {
        changes.push({ table: 'content_translations', id: fr.id, field: 'category_label', locale: 'fr', slug: tour.slug.substring(0,40), old: fr.category_label, new: categoryFR[deCat] });
      }
    }
    // HU
    if (categoryHU[deCat]) {
      const hu = cts.find(c => c.row_id === tour.id && c.locale === 'hu');
      if (hu && hu.category_label !== categoryHU[deCat] && hu.category_label === deCat) {
        changes.push({ table: 'content_translations', id: hu.id, field: 'category_label', locale: 'hu', slug: tour.slug.substring(0,40), old: hu.category_label, new: categoryHU[deCat] });
      }
    }
  }

  // Print dry-run
  console.log('=== DRY RUN: Step 1 Quick-Fact Fix ===');
  console.log('Total changes: ' + changes.length + '\n');

  const byField = {};
  changes.forEach(c => {
    const key = c.field + ' (' + c.locale + ')';
    if (!byField[key]) byField[key] = [];
    byField[key].push(c);
  });

  for (const [fieldLocale, items] of Object.entries(byField)) {
    console.log('--- ' + fieldLocale + ' (' + items.length + ' updates) ---');
    items.forEach(c => {
      console.log(' ' + c.slug.substring(0,45) + ' | "' + c.old + '"  →  "' + c.new + '"');
    });
    console.log('');
  }

  console.log('TOTAL: ' + changes.length + ' content_translations rows to update');

  // WRITE TO DB
  console.log('\n=== Writing to DB... ===');
  for (const ch of changes) {
    const { error } = await db.from('content_translations').update({ [ch.field]: ch.new }).eq('id', ch.id);
    if (error) console.error('FAIL id=' + ch.id + ' ' + ch.slug + ': ' + error.message);
  }
  console.log('Done! ' + changes.length + ' rows updated.');
})();
