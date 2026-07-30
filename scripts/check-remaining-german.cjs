require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {data: tours} = await db.from('tours').select('id, slug, itinerary');
  const {data: trs} = await db.from('content_translations').select('*').eq('table_name','tours');
  
  const seen = new Set();
  for (const tr of trs || []) {
    if (tr.locale === 'de' || !tr.content) continue;
    try {
      const steps = JSON.parse(tr.content);
      for (const step of steps) {
        const combined = (step.content || '') + ' ' + (step.title || '');
        const matches = combined.match(/\b(Abholung|Ankunft|Besuch|Fahrt|Mittagessen|Rückfahrt|Rücktransfer|Frühstück|Abendessen|Hotelabholung|Rückkehr|Schnorcheln|Besichtigung|Kamelritt|Beduinen|Wüstenstation|Glasbodenboot|Spider-Buggy|Ausflug|Führung|Stadtrundfahrt|Privater|Privaten|Lagunenfahrt|Weiterfahrt|Aufenthalt|Entspannung|Rückflug|Abflug|Einschiffung|Hafen|Anschluss|Besuchen|Entdecken|Erkunden|Genießen|Strand|Wüste|Insel|Boot|Tour|Nacht|Tag|Stunde|Minuten)\b/gi);
        if (matches) {
          const clean = step.content.replace(/[\\"]/g, '').substring(0, 100);
          const key = tr.locale + ': ' + matches.join(', ') + ' => ' + clean;
          if (!seen.has(key)) {
            seen.add(key);
          }
        }
      }
    } catch(e) {}
  }
  console.log('Remaining German words in content (' + seen.size + ' unique):\n');
  for (const s of [...seen].sort()) {
    console.log(s);
  }
})();
