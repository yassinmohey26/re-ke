require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const TOUR_ID = '30cb3bb8-2bcb-4863-a0ca-49220bdb6a1d';
const faqData = require('./mega-safari-faq-proposal.json').faqs;
const LOCALES = ['en', 'ar', 'ru', 'fr', 'hu'];

(async () => {
  for (const loc of LOCALES) {
    const { data, error } = await db.from('content_translations')
      .update({ faqs: faqData[loc] })
      .eq('table_name', 'tours')
      .eq('row_id', TOUR_ID)
      .eq('locale', loc)
      .select('id,locale,faqs');
    if (error) { console.error(`FAIL [${loc}]:`, error.message); continue; }
    const r = data[0];
    console.log(`OK [${r.locale}] faqs=${r.faqs?.length}`);
    if (r.faqs?.length !== 10) console.log(`    WARN length != 10`);
    console.log(`    Q0: ${r.faqs?.[0]?.question}`);
  }
})();
