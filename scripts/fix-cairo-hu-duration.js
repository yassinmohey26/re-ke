require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tour } = await db.from('tours').select('id').eq('slug', '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben').single();
  const { data: hu } = await db.from('content_translations').select('id').eq('table_name', 'tours').eq('row_id', tour.id).eq('locale', 'hu').single();
  await db.from('content_translations').update({ duration: '2 nap 1 éjszaka' }).eq('id', hu.id);
  console.log('Fixed HU duration: 8 ora -> 2 nap 1 ejjszaka');

  const { data: check } = await db.from('content_translations').select('duration, meeting_point').eq('id', hu.id).single();
  console.log('Verified HU: dur="' + check.duration + '" meet="' + check.meeting_point + '"');
})();
