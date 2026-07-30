require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

(async () => {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours').eq('locale', 'ar');

  for (const ct of cts) {
    const content = typeof ct.content === 'string' ? JSON.parse(ct.content) : ct.content;
    if (!Array.isArray(content)) continue;

    let hasGerman = false;
    const steps = content.map((item, i) => {
      const title = item.title || '';
      const body = item.content || '';
      const isGermanTitle = /[A-ZÄÖÜß][a-zäöüß]/.test(title) && !/[\u0600-\u06FF]/.test(title);
      const isGermanBody = /[A-ZÄÖÜß][a-zäöüß]/.test(body) && !/[\u0600-\u06FF]/.test(body) || (body.includes('und ') || body.includes('Sie ') || body.includes('Ihre'));
      if (isGermanTitle || isGermanBody) hasGerman = true;
      return { idx: i, row_id: ct.row_id?.substring(0,8), title, body, isGermanTitle, isGermanBody };
    });

    if (hasGerman) {
      console.log(`\n=== CT row_id: ${(ct.row_id||'').substring(0,8)} id: ${ct.id} ===`);
      steps.filter(s => s.isGermanTitle || s.isGermanBody).forEach(s => {
        if (s.isGermanTitle) console.log(`  title[${s.idx}]: "${s.title.substring(0,120)}"`);
        if (s.isGermanBody) console.log(`  body[${s.idx}]: "${s.body.substring(0,200)}"`);
      });
    }
  }
})();
