require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // First check if any updates actually got written
  const { data: cts } = await db.from('content_translations').select('id, row_id, locale, duration, meeting_point').eq('locale', 'en').eq('table_name', 'tours');
  const enDurations = cts.map(c => c.duration);
  const translated = enDurations.filter(d => d.includes('Hours') || d.includes('Days'));
  console.log('EN duration translations applied: ' + translated.length + '/26');
  console.log('EN meeting_point examples:');
  cts.slice(0, 3).forEach(c => console.log('  id=' + c.id + ': "' + c.meeting_point + '"'));

  // Check if there are still any German meeting_points in EN
  const germanMP = cts.filter(c => c.meeting_point && c.meeting_point.includes('Uhr'));
  console.log('EN meeting_point still German: ' + germanMP.length);

  if (germanMP.length > 0) {
    // Re-run the updates that didn't get applied
    const { data: tours } = await db.from('tours').select('id, slug, duration, meeting_point, category_label');
    const { data: allCts } = await db.from('content_translations').select('*').eq('table_name', 'tours');

    const meetingTranslations = {
      en: s => s.replace('ca. ', 'approx. ').replace('ca.', 'approx.').replace('Uhr', '').replace('Rotes Meer', 'Red Sea').replace('Aegypten', 'Egypt').replace(/\s+$/, ''),
      fr: s => s.replace('ca. ', 'env. ').replace('ca.', 'env.').replace('Uhr', '').replace('Rotes Meer', 'Mer Rouge').replace('Aegypten', 'Égypte').replace(/\s+$/, ''),
      ru: s => s.replace('ca. ', 'ок. ').replace('ca.', 'ок.').replace('Uhr', '').replace('Hurghada', 'Хургада').replace('Rotes Meer', 'Красное море').replace('Aegypten', 'Египет').replace(/\s+$/, ''),
      hu: s => s.replace('ca. ', 'kb. ').replace('ca.', 'kb.').replace('Uhr', '').replace('Rotes Meer', 'Vörös-tenger').replace('Aegypten', 'Egyiptom').replace(/\s+$/, '')
    };
    const durationEN = s => s.replace('Stunden', 'Hours').replace('Tage', 'Days').replace('Tag', 'Day').replace('Nacht', 'Night');
    const categoryEN = { 'Kultur Ausflüge': 'Cultural Excursions', 'Schnorchel Touren': 'Snorkel Tours', 'Safari Ausflüge': 'Safari Tours' };
    const categoryFR = { 'Kultur Ausflüge': 'Excursions culturelles', 'Schnorchel Touren': 'Excursions de snorkeling', 'Safari Ausflüge': 'Excursions safari' };
    const categoryHU = { 'Kultur Ausflüge': 'Kulturális kirándulások', 'Schnorchel Touren': 'Snorkel túrák', 'Safari Ausflüge': 'Safari kirándulások' };

    let updated = 0;
    for (const tour of tours) {
      // Duration — EN
      const en = allCts.find(c => c.row_id === tour.id && c.locale === 'en');
      if (en && en.duration === tour.duration) {
        const newDur = durationEN(tour.duration);
        if (newDur !== en.duration) {
          await db.from('content_translations').update({ duration: newDur }).eq('id', en.id);
          updated++;
        }
      }
      // Meeting point — all locales
      for (const loc of ['en', 'fr', 'ru', 'hu']) {
        const ct = allCts.find(c => c.row_id === tour.id && c.locale === loc);
        if (ct && ct.meeting_point === tour.meeting_point) {
          const newMeet = meetingTranslations[loc](tour.meeting_point || '');
          if (newMeet !== ct.meeting_point && newMeet !== '') {
            await db.from('content_translations').update({ meeting_point: newMeet }).eq('id', ct.id);
            updated++;
          }
        }
      }
      // Category label
      const deCat = tour.category_label;
      if (categoryEN[deCat]) {
        const en2 = allCts.find(c => c.row_id === tour.id && c.locale === 'en');
        if (en2 && en2.category_label === deCat && en2.category_label !== categoryEN[deCat]) {
          await db.from('content_translations').update({ category_label: categoryEN[deCat] }).eq('id', en2.id);
          updated++;
        }
      }
      if (categoryFR[deCat]) {
        const fr = allCts.find(c => c.row_id === tour.id && c.locale === 'fr');
        if (fr && fr.category_label === deCat && fr.category_label !== categoryFR[deCat]) {
          await db.from('content_translations').update({ category_label: categoryFR[deCat] }).eq('id', fr.id);
          updated++;
        }
      }
      if (categoryHU[deCat]) {
        const hu = allCts.find(c => c.row_id === tour.id && c.locale === 'hu');
        if (hu && hu.category_label === deCat && hu.category_label !== categoryHU[deCat]) {
          await db.from('content_translations').update({ category_label: categoryHU[deCat] }).eq('id', hu.id);
          updated++;
        }
      }
    }
    console.log('Applied ' + updated + ' remaining updates');
  }

  // Now spot-check 3 tours
  console.log('\n=== SPOT CHECK ===');
  const slugs = [
    '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
    'super-safari-hurghada',
    'orange-bay-insel-schnorchelausflug-hurghada'
  ];
  const { data: tours } = await db.from('tours').select('id, slug, duration, meeting_point, category_label').in('slug', slugs);
  for (const tour of tours) {
    console.log('\n--- ' + tour.slug.substring(0,40) + ' ---');
    console.log('DE: dur="' + tour.duration + '" | meet="' + tour.meeting_point + '" | cat="' + tour.category_label + '"');
    for (const loc of ['en', 'fr', 'ru', 'hu']) {
      const { data: ct } = await db.from('content_translations').select('duration, meeting_point, category_label').eq('table_name', 'tours').eq('row_id', tour.id).eq('locale', loc).single();
      if (ct) {
        console.log(' ' + loc + ': dur="' + ct.duration + '" | meet="' + ct.meeting_point + '" | cat="' + (ct.category_label || '') + '"');
      }
    }
  }
})();
