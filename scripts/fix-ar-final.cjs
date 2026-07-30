require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const IS_DRY_RUN = !process.argv.includes('--execute');

// Map of row_id => { bodyIndex => "exact current Db text" => "Arabic translation" }
// We'll fetch the actual text from DB first, then build the map
async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'ar');

  // Step 1: Show all body fields that still have >30% Latin chars
  const needsWork = [];
  for (const ct of cts) {
    const content = typeof ct.content === 'string' ? JSON.parse(ct.content) : ct.content;
    if (!Array.isArray(content)) continue;
    for (let i = 0; i < content.length; i++) {
      const body = content[i].content || '';
      const latinChars = (body.match(/[a-zA-ZÄÖÜäöüß]/g) || []).length;
      const totalChars = body.replace(/\s/g,'').length;
      if (totalChars > 25 && latinChars / totalChars > 0.25) {
        needsWork.push({ id: ct.id, row_id: ct.row_id, idx: i, body, latinPct: Math.round(latinChars/totalChars*100) });
      }
    }
  }

  console.log(`Found ${needsWork.length} body fields with significant Latin content.\n`);
  for (const nw of needsWork) {
    console.log(`[${nw.row_id?.substring(0,8)}][${nw.idx}] (${nw.latinPct}% latin):`);
    console.log(nw.body);
    console.log();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
