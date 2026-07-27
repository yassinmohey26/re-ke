const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: rows, error } = await supabase
    .from('content_translations')
    .select('*')
    .eq('locale', 'ar')
    .eq('table_name', 'tours');

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${rows.length} Arabic tour translation rows`);

  for (const row of rows) {
    if (!row.name) {
      console.log(`Tour ID ${row.row_id}: No name column value`);
      continue;
    }
    const mainParts = row.name.split(/---\s*تسيب\s*---/);
    console.log(`Tour ID ${row.row_id} (${row.name.substring(0, 40)}...): splits into ${mainParts.length} parts`);
    if (mainParts.length !== 9) {
      console.log(`  WARNING: Unexpected parts count: ${mainParts.length}`);
      mainParts.forEach((p, idx) => {
        console.log(`    Part ${idx}: ${p.substring(0, 60).replace(/\r?\n/g, ' ')}...`);
      });
    }
  }
})();
