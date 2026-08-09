require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const BATCH = {
  '14475177-96d0-4d67-b5ca-4b277f3d6a7e': { // family-safari-hurghada
    en: 'Family Desert Safari Hurghada – Quad, Jeep & Bedouin Village',
    ar: 'سفاري العائلة في الغردقة – كواد وجيب وقرية بدوية',
    ru: 'Семейное сафари в Хургаде – квадроцикл, джип и бедуинская деревня',
    fr: 'Safari familial à Hurghada – Quad, Jeep et village bédouin',
    hu: 'Családi szafari Hurghadában – Quad, Jeep és beduin falu',
  },
  '30cb3bb8-2bcb-4863-a0ca-49220bdb6a1d': { // mega-safari-hurghada
    en: 'Mega Safari Hurghada – Quad & Spider Car Adventure',
    ar: 'ميجا سفاري الغردقة – مغامرة الكواد وسيارة سبايدر',
    ru: 'Мега-сафари в Хургаде – приключение на квадроцикле и Spider Car',
    fr: 'Mega Safari à Hurghada – Aventure en quad et Spider Car',
    hu: 'Mega szafari Hurghadában – Quad & Spider Car kaland',
  },
};

(async () => {
  for (const [tourId, locales] of Object.entries(BATCH)) {
    for (const [loc, name] of Object.entries(locales)) {
      const { data, error } = await db.from('content_translations')
        .update({ name })
        .eq('table_name', 'tours')
        .eq('row_id', tourId)
        .eq('locale', loc)
        .select('id,row_id,locale,name');
      if (error) { console.error(`FAIL ${tourId} ${loc}:`, error.message); continue; }
      console.log(`OK ${tourId.slice(0,8)} [${loc}] name -> ${data[0].name}`);
    }
  }
})();
