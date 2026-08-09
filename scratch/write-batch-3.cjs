require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const TOUR_ID = '5a9c2e86-9d98-41de-a4c4-54523b45cf13';
const fields = require('./batch-3-proposal.json').proposal;
const faqData = require('./batch-3-faq-proposal.json').faqs;
const LOCALES = ['en', 'ar', 'ru', 'fr', 'hu'];

(async () => {
  for (const loc of LOCALES) {
    const payload = {
      name: fields[loc].name,
      short_description: fields[loc].short_description,
      highlights: fields[loc].highlights,
      included: fields[loc].included,
      not_included: fields[loc].not_included,
      description: fields[loc].description,
      faqs: faqData[loc],
    };
    const { data, error } = await db.from('content_translations')
      .update(payload)
      .eq('table_name', 'tours')
      .eq('row_id', TOUR_ID)
      .eq('locale', loc)
      .select('id,locale,name,short_description,description,highlights,included,not_included,faqs');
    if (error) { console.error(`FAIL [${loc}]:`, error.message); continue; }
    const r = data[0];
    console.log(`OK [${r.locale}] name=${JSON.stringify(r.name)}`);
    console.log(`    short=${JSON.stringify(r.short_description?.slice(0, 60))}`);
    console.log(`    highlights=${r.highlights?.length} included=${r.included?.length} not_included=${r.not_included?.length} faqs=${r.faqs?.length} descLen=${r.description?.length}`);
    if (r.faqs?.length !== 10) console.log(`    WARN faqs length ${r.faqs?.length} != 10`);
  }
})();
