require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug, duration, meeting_point, category_label');
  // Re-fetch cts fresh (some may have been updated by prior partial run)
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours');

  // Find remaining items
  const remaining = [];

  // Duration — EN
  for (const tour of tours) {
    const en = cts.find(c => c.row_id === tour.id && c.locale === 'en');
    if (en && en.duration === tour.duration) {
      const newDur = tour.duration.replace('Stunden', 'Hours').replace('Tage', 'Days').replace('Tag', 'Day').replace('Nacht', 'Night');
      remaining.push({ id: en.id, field: 'duration', val: newDur, desc: tour.slug.substring(0,40) + ' EN duration' });
    }
  }

  // Meeting point
  const meetingMap = {
    en: s => s.replace('ca. ', 'approx. ').replace('ca.', 'approx.').replace('Uhr', '').replace('Rotes Meer', 'Red Sea').replace('Aegypten', 'Egypt').replace(/\s+$/, ''),
    fr: s => s.replace('ca. ', 'env. ').replace('ca.', 'env.').replace('Uhr', '').replace('Rotes Meer', 'Mer Rouge').replace('Aegypten', 'Égypte').replace(/\s+$/, ''),
    ru: s => s.replace('ca. ', 'ок. ').replace('ca.', 'ок.').replace('Uhr', '').replace('Hurghada', 'Хургада').replace('Rotes Meer', 'Красное море').replace('Aegypten', 'Египет').replace(/\s+$/, ''),
    hu: s => s.replace('ca. ', 'kb. ').replace('ca.', 'kb.').replace('Uhr', '').replace('Rotes Meer', 'Vörös-tenger').replace('Aegypten', 'Egyiptom').replace(/\s+$/, '')
  };

  for (const loc of ['en', 'fr', 'ru', 'hu']) {
    for (const tour of tours) {
      const ct = cts.find(c => c.row_id === tour.id && c.locale === loc);
      if (ct && ct.meeting_point === tour.meeting_point) {
        const newMeet = meetingMap[loc](tour.meeting_point || '');
        if (newMeet !== ct.meeting_point && newMeet !== '') {
          remaining.push({ id: ct.id, field: 'meeting_point', val: newMeet, desc: tour.slug.substring(0,40) + ' ' + loc + ' meeting_point' });
        }
      }
    }
  }

  // Category label
  const catMap = {
    en: { 'Kultur Ausflüge': 'Cultural Excursions', 'Schnorchel Touren': 'Snorkel Tours', 'Safari Ausflüge': 'Safari Tours' },
    fr: { 'Kultur Ausflüge': 'Excursions culturelles', 'Schnorchel Touren': 'Excursions de snorkeling', 'Safari Ausflüge': 'Excursions safari' },
    hu: { 'Kultur Ausflüge': 'Kulturális kirándulások', 'Schnorchel Touren': 'Snorkel túrák', 'Safari Ausflüge': 'Safari kirándulások' }
  };

  for (const loc of ['en', 'fr', 'hu']) {
    for (const tour of tours) {
      const deCat = tour.category_label;
      if (!catMap[loc][deCat]) continue;
      const ct = cts.find(c => c.row_id === tour.id && c.locale === loc);
      if (ct && ct.category_label === deCat) {
        remaining.push({ id: ct.id, field: 'category_label', val: catMap[loc][deCat], desc: tour.slug.substring(0,40) + ' ' + loc + ' category_label' });
      }
    }
  }

  console.log('Remaining updates: ' + remaining.length);
  if (remaining.length === 0) {
    console.log('All done!');
    return;
  }

  // Batch update — 10 at a time
  for (let i = 0; i < remaining.length; i += 10) {
    const batch = remaining.slice(i, i + 10);
    const promises = batch.map(r =>
      db.from('content_translations').update({ [r.field]: r.val }).eq('id', r.id)
    );
    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error).length;
    console.log('  batch ' + (i/10+1) + ': ' + batch.length + ' updates, ' + errors + ' errors');
    if (errors > 0) results.forEach((r, j) => { if (r.error) console.log('    FAIL id=' + batch[j].id + ': ' + r.error.message); });
  }

  // Verify
  console.log('\n=== Verification ===');
  for (const slug of ['2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben', 'super-safari-hurghada', 'orange-bay-insel-schnorchelausflug-hurghada']) {
    const tour = tours.find(t => t.slug === slug);
    console.log('\n--- ' + slug.substring(0,40) + ' ---');
    console.log('DE: dur="' + tour.duration + '" meet="' + tour.meeting_point + '" cat="' + tour.category_label + '"');
    for (const loc of ['en', 'fr', 'ru', 'hu']) {
      const ct = cts.find(c => c.row_id === tour.id && c.locale === loc);
      if (!ct) continue;
      // Re-fetch to get updated values
      const { data: fresh } = await db.from('content_translations').select('duration, meeting_point, category_label').eq('id', ct.id).single();
      if (fresh) console.log(' ' + loc + ': dur="' + fresh.duration + '" meet="' + fresh.meeting_point + '" cat="' + (fresh.category_label || '') + '"');
    }
  }
})();
