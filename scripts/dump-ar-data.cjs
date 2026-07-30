require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const fs = require('fs');

(async()=>{
  const {data: tours} = await db.from('tours').select('id, slug');
  const {data: trs} = await db.from('content_translations').select('*').eq('table_name','tours');

  const output = [];

  for (const tour of tours) {
    const de = trs.find(t => t.row_id === tour.id && t.locale === 'de');
    const ar = trs.find(t => t.row_id === tour.id && t.locale === 'ar');
    if (!de || !ar) continue;

    let entry = { slug: tour.slug, needs_itin_fix: false, needs_faq_fix: false, needs_list_fix: false, details: [] };

    // Itinerary check
    if (ar.content && de.content) {
      try {
        const arSteps = JSON.parse(ar.content);
        const deSteps = typeof de.content === 'string' ? JSON.parse(de.content) : de.content || [];
        const contentStr = JSON.stringify(arSteps);
        if (/\b(Abholung|Ankunft|Besuch|Fahrt|Mittagessen|Rückfahrt|Rücktransfer|Frühstück|Abendessen|Hotelabholung|Rückkehr|schnorcheln|Schnorcheln|Besichtigung|Kamelritt|Weiterfahrt|Aufenthalt|Entspannung|Rückflug|Stadtrundfahrt|Lagunenfahrt|Glasbodenboot)\b/i.test(contentStr)) {
          entry.needs_itin_fix = true;
          entry.details.push({type:'itinerary', deSteps: deSteps.map(s=>({title:s.title||'', content:s.content||''})), arSteps: arSteps.map(s=>({title:s.title||'', content:s.content||''})) });
        }
      } catch(e) {}
    }

    // FAQ check
    if (Array.isArray(de.faqs) && Array.isArray(ar.faqs) && de.faqs.length !== ar.faqs.length) {
      entry.needs_faq_fix = true;
      entry.details.push({type:'faq', deFaqs: de.faqs, arFaqs: ar.faqs});
    }

    // List checks
    for (const f of ['highlights','included','not_included']) {
      if (Array.isArray(de[f]) && Array.isArray(ar[f]) && de[f].length !== ar[f].length) {
        entry.needs_list_fix = true;
        entry.details.push({type:'list_' + f, deItems: de[f], arItems: ar[f]});
      }
    }

    if (entry.needs_itin_fix || entry.needs_faq_fix || entry.needs_list_fix) {
      output.push(entry);
    }
  }

  fs.writeFileSync('scripts/ar-data-dump.json', JSON.stringify(output, null, 2));
  console.log('Dumped ' + output.length + ' tours with AR issues');
})();
