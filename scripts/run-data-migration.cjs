// Data Migration: Steps 2-4 and 8
// Assumes pickup_time_slots column already exists (Step 1 done manually)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const MIGRATION = [
  { tourId: '7b681580-bfb6-4e96-913f-47c64cf2231c', slug: 'private-speedboot-tour-orange-bay-hurghada', timeSlots: ['08:00'],
    templates: { en: 'approx. {time}', ru: 'примерно в {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d', slug: 'kloester-st-antonius-st-paulus', timeSlots: ['04:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '14475177-96d0-4d67-b5ca-4b277f3d6a7e', slug: 'family-safari-hurghada', timeSlots: ['08:30', '13:30'],
    templates: { en: 'Hotel lobby in Hurghada (approx. {time} – exact pick-up time confirmed upon booking)', ru: 'Лобби вашего отеля в Хургаде (около {time} – точное время подтверждается при бронировании)', fr: "Hall de votre hôtel à Hurghada (vers {time} – l'heure exacte de prise en charge est confirmée lors de la réservation)", hu: 'Hurghada-i szállodájának recepciója (kb. {time} – a pontos felvételi időt a foglaláskor erősítik meg)', ar: 'ردهة فندقك في الغردقة (حوالي الساعة {time} – يُؤكد وقت الاستلام الدقيق عند الحجز)' } },
  { tourId: '17a82d9b-2d00-4a29-8528-3c2e97a6bf26', slug: 'mahmya-insel-ausflug-hurghada', timeSlots: ['08:00'],
    templates: { en: 'approx. {time}', ru: 'ок. {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '5a9c2e86-9d98-41de-a4c4-54523b45cf13', slug: 'family-abendsafari-hurghada', timeSlots: [],
    templates: { en: 'Hurghada - Red Sea - Egypt', ru: 'Хургада - Красное море - Египет', fr: 'Hurghada - Mer Rouge - Egypte', hu: 'Hurghada - Vörös-tenger - Egyiptom', ar: 'الغردقة - البحر الأحمر - مصر' } },
  { tourId: 'f265b20c-db45-4173-a352-b1921fd7f744', slug: 'hula-hula-insel-schnorchelausflug-hurghada', timeSlots: ['08:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '8c5d9ce5-9931-42a6-8f09-44adf155d616', slug: 'mini-egypt-park-hurghada', timeSlots: ['10:00'],
    templates: { en: 'approx. {time}', ru: 'ок. {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'بالتواصل معنا' } },
  { tourId: 'c7b7cfad-0101-4997-ac52-e4456a21c252', slug: 'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh', timeSlots: ['02:00'],
    templates: { en: 'approx. {time}', ru: 'примерно в {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '1c5a3c79-ab29-46c7-b480-36954adcc661', slug: 'luxor-tagesausflug-heissluftballon-hoteluebernachtung', timeSlots: ['17:00'],
    templates: { en: 'approx. {time}', ru: 'ок. {time}', fr: 'vers {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} مساءً' } },
  { tourId: 'a8ddb433-a4fb-41ca-b90d-b399b4a57923', slug: 'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel', timeSlots: ['06:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '6b629662-908c-40e3-b396-565393a6be18', slug: 'makadi-water-park-hurghada-mittagessen-transfer', timeSlots: ['09:00'],
    templates: { en: 'approx. {time}', ru: 'ок. {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '65f786e7-75c3-457b-a66a-e9f91f2c950e', slug: 'kairo-mit-flug-ab-hurghada-pyramiden-museum', timeSlots: ['04:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '80dc4e17-ea30-4511-92be-5e8add77f139', slug: 'eintrittskarte-zum-hurghada-grand-aquarium', timeSlots: ['10:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'vers {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', slug: 'private-delfin-tour-hurghada', timeSlots: ['08:00'],
    templates: { en: 'approx. {time}', ru: 'примерно в {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: 'b604535f-6c99-4766-9150-c29fbbf5678c', slug: 'eden-island-schnorchelausflug-hurghada', timeSlots: ['08:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '0009b90b-71a9-4e78-8459-e56bacce7cbf', slug: 'glasbodenboot-hurghada-mit-schnorcheln', timeSlots: ['12:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} ظهراً' } },
  { tourId: 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a', slug: 'naechtliche-stadtrundfahrt-durch-hurghada-private-tour', timeSlots: ['19:00'],
    templates: { en: 'approx. {time}', ru: 'ок. {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} مساءً' } },
  { tourId: 'b2dc19de-fc9f-4a96-a742-7646e16a8486', slug: 'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang', timeSlots: ['12:00'],
    templates: { en: 'approx. {time}', ru: 'примерно в {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} مساءً' } },
  { tourId: '69aa0c36-125f-4f41-8502-55a8f4fd6d98', slug: 'orange-bay-insel-schnorchelausflug-hurghada', timeSlots: ['08:00'],
    templates: { en: 'approx. {time}', ru: 'ок. {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '42a2941f-6b90-4f0a-9593-0ec1ec980a13', slug: 'luxor-tagesausflug-ab-hurghada', timeSlots: ['04:00'],
    templates: { en: 'approx. {time}', ru: 'ок. {time}', fr: 'vers {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} فجراً' } },
  { tourId: '380712ad-0b71-4e9a-8bfd-4e34c6906afc', slug: 'quad-tour-hurghada-kamelritt', timeSlots: ['08:00'],
    templates: { en: 'approx. {time}', ru: 'примерно в {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '94351900-ac6d-4c76-92e1-f9e1b1744f2f', slug: 'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum', timeSlots: ['02:00'],
    templates: { en: 'approx. {time}', ru: 'примерно в {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae', slug: 'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel', timeSlots: ['04:00'],
    templates: { en: 'approx. {time}', ru: 'примерно в {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '4f91f20d-ead4-4473-8700-371d4cb5fc4e', slug: 'hurghada-shopping-tour-basar-transfer', timeSlots: [],
    templates: { en: 'Hurghada - Red Sea - Egypt', ru: 'Хургада - Красное море - Египет', fr: 'Hurghada - Mer Rouge - Egypte', hu: 'Hurghada - Vörös-tenger - Egyiptom', ar: 'الغردقة - البحر الأحمر - مصر' } },
  { tourId: '30cb3bb8-2bcb-4863-a0ca-49220bdb6a1d', slug: 'mega-safari-hurghada', timeSlots: ['08:30', '15:00'],
    templates: { en: 'Around {time}', ru: 'Около {time}', fr: 'Vers {time}', hu: 'Kb. {time}', ar: 'حوالي {time}' } },
  { tourId: 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', slug: '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben', timeSlots: ['02:00'],
    templates: { en: 'approx. {time}', ru: 'Хургада - Красное море - Египет', fr: 'Hurghada - Mer Rouge - Egypte', hu: 'Hurghada - Vörös-tenger - Egyiptom', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '77f34e21-9d9d-4be6-90b3-8148b2d82214', slug: 'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm', timeSlots: ['10:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} صباحاً' } },
  { tourId: '3ebed770-c1d0-44dd-8d95-590fdec83f74', slug: 'reiten-in-hurghada-strand-wueste-pferde-im-meer', timeSlots: ['10:00'],
    templates: { en: 'approx. {time}', ru: 'около {time}', fr: 'environ {time}', hu: 'kb. {time}', ar: 'نحو الساعة {time}' } },
  { tourId: '872d19ae-dd4c-4c01-9f1b-217e481b3732', slug: 'super-safari-hurghada', timeSlots: ['13:00'],
    templates: { en: 'approx. {time}', ru: 'примерно в {time}', fr: 'env. {time}', hu: 'kb. {time}', ar: 'حوالي الساعة {time} مساءً' } },
];

const GRAND_AQUARIUM_ID = '80dc4e17-ea30-4511-92be-5e8add77f139';
const CULTURE_LABELS = { en: 'Culture Tours', ru: 'Культурные туры', fr: 'Excursions culturelles', hu: 'Kulturális kirándulások' };
const LOCALES = ['en', 'ru', 'fr', 'hu', 'ar'];

(async () => {
  let totalErrors = 0;

  // --- STEP 2: Populate pickup_time_slots ---
  console.log('\n' + '='.repeat(60));
  console.log(`STEP 2: Populate pickup_time_slots for ${MIGRATION.length} tours`);
  console.log('='.repeat(60));
  let errs = 0;
  for (const e of MIGRATION) {
    const { error } = await db.from('tours').update({ pickup_time_slots: e.timeSlots }).eq('id', e.tourId);
    if (error) { console.error(`  ❌ ${e.slug}: ${error.message}`); errs++; }
    else console.log(`  ✅ ${e.slug}: ${JSON.stringify(e.timeSlots)}`);
  }
  totalErrors += errs;
  console.log(errs === 0 ? '\n✅ Step 2 complete.' : `\n⚠️  ${errs} errors in Step 2.`);

  // --- STEP 3: Fix Grand Aquarium category_label ---
  console.log('\n' + '='.repeat(60));
  console.log('STEP 3: Fix Grand Aquarium category_label (en/ru/fr/hu → Culture)');
  console.log('='.repeat(60));
  errs = 0;
  for (const [loc, label] of Object.entries(CULTURE_LABELS)) {
    const { error } = await db.from('content_translations')
      .update({ category_label: label })
      .eq('table_name', 'tours').eq('row_id', GRAND_AQUARIUM_ID).eq('locale', loc);
    if (error) { console.error(`  ❌ [${loc}]: ${error.message}`); errs++; }
    else console.log(`  ✅ [${loc}]: "${label}"`);
  }
  totalErrors += errs;
  console.log(errs === 0 ? '\n✅ Step 3 complete.' : `\n⚠️  ${errs} errors in Step 3.`);

  // --- STEP 4: Fix Grand Aquarium meeting_point spacing ---
  console.log('\n' + '='.repeat(60));
  console.log('STEP 4: Fix Grand Aquarium base meeting_point spacing');
  console.log('='.repeat(60));
  const { data: aqRow } = await db.from('tours').select('meeting_point').eq('id', GRAND_AQUARIUM_ID).single();
  console.log(`  Current: "${aqRow?.meeting_point}"`);
  if (aqRow?.meeting_point && aqRow.meeting_point.includes('ca.10')) {
    const { error } = await db.from('tours').update({ meeting_point: 'ca. 10:00 Uhr' }).eq('id', GRAND_AQUARIUM_ID);
    if (error) { console.error(`  ❌ ${error.message}`); totalErrors++; }
    else console.log('  ✅ Fixed to "ca. 10:00 Uhr".');
  } else {
    console.log('  ℹ️  Already correct, skipping.');
  }

  // --- STEP 8: Nullify duration + write {time} templates to content_translations ---
  console.log('\n' + '='.repeat(60));
  console.log('STEP 8: Null duration + write meeting_point templates in content_translations');
  console.log('='.repeat(60));
  let updated = 0; errs = 0;
  for (const e of MIGRATION) {
    for (const loc of LOCALES) {
      const template = e.templates[loc];
      if (!template) continue;
      const { data: existing } = await db.from('content_translations')
        .select('id')
        .eq('table_name', 'tours').eq('row_id', e.tourId).eq('locale', loc)
        .maybeSingle();
      if (existing) {
        const { error } = await db.from('content_translations')
          .update({ duration: null, meeting_point: template })
          .eq('id', existing.id);
        if (error) { console.error(`  ❌ ${e.slug}[${loc}]: ${error.message}`); errs++; }
        else updated++;
      } else {
        // Missing locale row — create it with German fallback content so the
        // {time} template is actually stored and no CT row is left missing.
        const { data: deRow } = await db.from('content_translations')
          .select('name,short_description,description,category_label,highlights,included,not_included,faqs')
          .eq('table_name', 'tours').eq('row_id', e.tourId).eq('locale', 'de')
          .maybeSingle();
        const { error } = await db.from('content_translations')
          .insert({
            table_name: 'tours', row_id: e.tourId, locale: loc,
            name: deRow?.name ?? null,
            short_description: deRow?.short_description ?? null,
            description: deRow?.description ?? null,
            category_label: deRow?.category_label ?? null,
            highlights: deRow?.highlights ?? [],
            included: deRow?.included ?? [],
            not_included: deRow?.not_included ?? [],
            faqs: deRow?.faqs ?? [],
            duration: null,
            meeting_point: template,
          });
        if (error) { console.error(`  ❌ ${e.slug}[${loc}] insert: ${error.message}`); errs++; }
        else { console.log(`  ➕ ${e.slug}[${loc}] created from DE fallback`); updated++; }
      }
    }
  }
  console.log(`  Updated ${updated} rows.`);
  totalErrors += errs;
  console.log(errs === 0 ? '\n✅ Step 8 complete.' : `\n⚠️  ${errs} errors in Step 8.`);

  // --- SPOT-CHECK ---
  console.log('\n' + '='.repeat(60));
  console.log('SPOT-CHECK: 6 key tours');
  console.log('='.repeat(60));
  const KEY_SLUGS = ['family-safari-hurghada', 'private-speedboot-tour-orange-bay-hurghada',
    'luxor-tagesausflug-heissluftballon-hoteluebernachtung', 'private-delfin-tour-hurghada',
    'luxor-tagesausflug-ab-hurghada', 'eintrittskarte-zum-hurghada-grand-aquarium'];
  const { data: kTours } = await db.from('tours').select('id,slug,duration_hours,meeting_point,pickup_time_slots').in('slug', KEY_SLUGS);
  const { data: kTrs } = await db.from('content_translations').select('row_id,locale,duration,meeting_point,category_label')
    .eq('table_name', 'tours').in('row_id', kTours.map(t => t.id));
  for (const slug of KEY_SLUGS) {
    const tour = kTours.find(t => t.slug === slug);
    if (!tour) { console.log(`  [NOT FOUND] ${slug}`); continue; }
    console.log(`\n  ${slug}`);
    console.log(`    hours=${tour.duration_hours} | slots=${JSON.stringify(tour.pickup_time_slots)} | meeting="${tour.meeting_point}"`);
    for (const loc of ['en', 'fr', 'ar']) {
      const tr = kTrs.find(r => r.row_id === tour.id && r.locale === loc);
      console.log(`    [${loc}] duration=${tr?.duration ?? 'null'} | template="${tr?.meeting_point ?? '(null)'}"`);
    }
    if (slug === 'eintrittskarte-zum-hurghada-grand-aquarium') {
      for (const loc of ['en', 'ru', 'fr', 'hu']) {
        const tr = kTrs.find(r => r.row_id === tour.id && r.locale === loc);
        console.log(`    [${loc}] category_label="${tr?.category_label ?? '(null)'}"`);
      }
    }
  }

  console.log(`\n\n${totalErrors === 0 ? '✅ ALL DATA MIGRATION STEPS COMPLETE.' : `⚠️  COMPLETED WITH ${totalErrors} ERRORS.`}`);
})();
