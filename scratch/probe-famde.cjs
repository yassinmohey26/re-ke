require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours } = await db.from('tours').select('id,slug,name,short_description,description,highlights,included,not_included,faqs,category_label,itinerary').eq('slug','family-abendsafari-hurghada');
  const t = tours[0];
  console.log('=== BASE tours row ===');
  console.log(JSON.stringify(t, null, 2).slice(0, 2000));
  const { data: trs } = await db.from('content_translations').select('*').eq('table_name','tours').eq('row_id',t.id).eq('locale','de');
  const de = trs[0];
  console.log('\n=== DE CT row ===');
  if (de) {
    console.log('name:', JSON.stringify(de.name));
    console.log('short_description:', JSON.stringify(de.short_description));
    console.log('description (first 300):', JSON.stringify((de.description||'').slice(0,300)));
    console.log('category_label:', JSON.stringify(de.category_label));
    console.log('highlights:', JSON.stringify(de.highlights));
    console.log('included:', JSON.stringify(de.included));
    console.log('not_included:', JSON.stringify(de.not_included));
    console.log('faqs count:', Array.isArray(de.faqs) ? de.faqs.length : JSON.stringify(de.faqs));
    console.log('content (itinerary):', typeof de.content === 'string' ? de.content.slice(0,300) : JSON.stringify(de.content));
  } else {
    console.log('NO DE ROW');
  }
})();
