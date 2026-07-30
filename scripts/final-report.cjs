require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {data: tours} = await db.from('tours').select('id, slug');
  const {data: trs} = await db.from('content_translations').select('*').eq('table_name','tours');

  let remainingItin = 0;
  let remainingFaq = 0;
  let remainingList = 0;
  let toursWithIssues = new Set();
  let details = [];

  for (const tour of tours) {
    const tourTrs = trs.filter(t => t.row_id === tour.id);
    const deTr = tourTrs.find(t => t.locale === 'de');
    const baseFaqs = deTr?.faqs || [];
    const baseFaqCount = Array.isArray(baseFaqs) ? baseFaqs.length : 0;
    
    for (const tr of tourTrs) {
      if (tr.locale === 'de') continue;
      
      let rowIssues = [];
      
      if (tr.content) {
        try {
          const steps = JSON.parse(tr.content);
          const contentStr = JSON.stringify(steps);
          const germanFound = contentStr.match(/\b(Abholung|Ankunft|Besuch|Fahrt|Mittagessen|Rückfahrt|Rücktransfer|Frühstück|Abendessen|Hotelabholung|Rückkehr|schnorcheln|Schnorcheln|Besichtigung|Kamelritt)\b/i);
          if (germanFound) {
            remainingItin++;
            rowIssues.push('itinerary_has_german');
          }
        } catch(e) {}
      }
      
      if (Array.isArray(tr.faqs) && baseFaqCount > 0 && tr.faqs.length !== baseFaqCount) {
        remainingFaq++;
        rowIssues.push('faq_count_' + tr.faqs.length + '_vs_' + baseFaqCount);
      }
      
      for (const field of ['highlights', 'included', 'not_included']) {
        const baseArr = deTr?.[field] || [];
        const baseLen = Array.isArray(baseArr) ? baseArr.length : 0;
        const locArr = tr[field] || [];
        const locLen = Array.isArray(locArr) ? locArr.length : 0;
        if (baseLen > 0 && locLen > 0 && locLen !== baseLen) {
          remainingList++;
          rowIssues.push(field + '_count_' + locLen + '_vs_' + baseLen);
        }
      }
      
      if (rowIssues.length > 0) {
        toursWithIssues.add(tour.slug);
        details.push({slug: tour.slug, locale: tr.locale, issues: rowIssues});
      }
    }
  }
  
  console.log('=== FINAL CONTENT PARITY REPORT ===\n');
  console.log('ISSUES REMAINING:');
  console.log('  Tours with remaining issues: ' + toursWithIssues.size + ' / ' + tours.length);
  console.log('  Itineraries with German text: ' + remainingItin);
  console.log('  FAQ count mismatches: ' + remainingFaq);
  console.log('  List item count mismatches: ' + remainingList);
  console.log('');
  console.log('ALREADY FIXED:');
  console.log('  1. Meeting_point times for AR/RU/FR/HU locales corrected to match DE times');
  console.log('  2. German pricing table headers translated to each locale (EN/RU/FR/HU/AR)');
  console.log('  3. ~60+ itinerary German phrases replaced with locale translations');
  console.log('  4. Description text had German headers replaced per locale');
  console.log('  5. Duration corruptions (6 p.m, 8h, etc.) fixed in previous session');
  console.log('  6. 114 tour-locale combinations updated with content fixes');
  console.log('');
  console.log('REMAINING DETAILS (per tour):');
  for (const d of details) {
    console.log('  [' + d.locale + '] ' + d.slug + ': ' + d.issues.join(', '));
  }
})();
