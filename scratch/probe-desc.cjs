require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: trs } = await db.from('content_translations').select('description').eq('table_name','tours').eq('locale','de').eq('row_id','5a9c2e86-9d98-41de-a4c4-54523b45cf13');
  const desc = trs[0]?.description || '';
  console.log('desc length:', desc.length);
  const markers = ['Teilnehmer','Fahrzeug','Preis pro Person','Teilnehmeranzahl','tour-pricing-table'];
  for (const m of markers) console.log(`  contains "${m}":`, desc.includes(m));
  console.log('\n--- tail (last 600 chars) ---');
  console.log(desc.slice(-600));
})();
