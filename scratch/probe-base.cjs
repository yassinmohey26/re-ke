require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours } = await db.from('tours').select('id,slug,meeting_point,duration,duration_hours');
  if (!tours) return;
  console.log(`Total tours: ${tours.length}\n`);
  for (const t of tours) {
    console.log(`  ${t.slug} | hours=${t.duration_hours} | base.duration="${t.duration}" | base.meeting="${t.meeting_point}"`);
  }
})();
