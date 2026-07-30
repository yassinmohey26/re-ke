require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
(async () => {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'ar');
  // Check for any German-like words in body content that are still >50% Latin
  for (const ct of cts) {
    const content = typeof ct.content === 'string' ? JSON.parse(ct.content) : ct.content;
    for (const item of content||[]) {
      const body = item.content || '';
      const latinChars = (body.match(/[a-zA-ZÄÖÜäöüß]/g) || []).length;
      const totalChars = body.replace(/\s/g,'').length;
      if (totalChars > 20 && latinChars / totalChars > 0.3) {
        console.log(`Row ${(ct.row_id||'').substring(0,8)} body: ${body.substring(0,300)}`);
        console.log(`  (${latinChars}/${totalChars} latin chars = ${Math.round(latinChars/totalChars*100)}%)\n`);
      }
    }
  }
})();
