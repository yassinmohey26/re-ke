require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALES = ['en','ru','fr','hu','ar'];
const TIME_PATTERN = /\b(\d{1,2}:\d{2})\s*(Uhr|AM|PM|a\.m|p\.m|am|pm)\b/i;
const LOCATION_KEYWORDS = ['Red Sea','Rotes Meer','Красное море','Vörös-tenger','Mer Rouge','Hotel pickup'];

function extractDurationNum(s){ if(!s) return null; const m=s.match(/(\d+)\s*(Tag|day|jour|jour|День|nap|giorno|día)?/i); return m?parseInt(m[1]):null; }
function isDurationActuallyTime(s){ return s?TIME_PATTERN.test(s):false; }
function isMeetingPointLocationNotTime(s){ if(!s) return false; if(TIME_PATTERN.test(s)) return false; if(LOCATION_KEYWORDS.some(k=>s.includes(k))) return true; if(s.trim()==='') return true; return false; }

(async () => {
  const { data: tours } = await db.from('tours').select('id,slug,meeting_point,duration,itinerary,faqs,highlights,included,not_included,description');
  const { data: allTrs } = await db.from('content_translations').select('*').eq('table_name','tours');
  if (!tours || !allTrs) return;
  const trMap = {};
  for (const tr of allTrs) { (trMap[tr.row_id] = trMap[tr.row_id] || {})[tr.locale] = tr; }

  let total = 0; const reports = [];
  for (const tour of tours) {
    const issues = [];
    for (const loc of LOCALES) {
      const tr = trMap[tour.id]?.[loc];
      if (!tr) { issues.push(`[${loc}] duration: MISSING_ROW`); continue; }
      if (tr.duration !== null && isDurationActuallyTime(tr.duration)) issues.push(`[${loc}] duration: WRONG_VALUE_IS_TIME ("${tr.duration}")`);
      if (isMeetingPointLocationNotTime(tr.meeting_point) && tour.meeting_point && TIME_PATTERN.test(tour.meeting_point)) {
        issues.push(`[${loc}] meeting_point: WRONG_VALUE_IS_LOCATION ("${tr.meeting_point}")`);
      }
      if ((!tr.meeting_point || tr.meeting_point.trim()==='') && tour.meeting_point && tour.meeting_point.trim()!=='') {
        issues.push(`[${loc}] meeting_point: EMPTY`);
      }
      if (tr.meeting_point && tour.meeting_point) {
        const a=tr.meeting_point.match(/(\d{1,2}):(\d{2})/), b=tour.meeting_point.match(/(\d{1,2}):(\d{2})/);
        if (a&&b&&a[1]!==b[1]){ const diff=Math.abs(parseInt(a[1])-parseInt(b[1])); if(diff>1) issues.push(`[${loc}] meeting_point: TIME_MISMATCH ("${tr.meeting_point}" vs "${tour.meeting_point}")`); }
      }
    }
    // itinerary
    let baseItin=[]; try{ baseItin = typeof tour.itinerary==='string' ? JSON.parse(tour.itinerary) : (Array.isArray(tour.itinerary)?tour.itinerary:[]); }catch(e){}
    for (const loc of LOCALES) {
      const tr = trMap[tour.id]?.[loc]; if(!tr) continue;
      let locItin=[]; if(tr.content){ try{ locItin=JSON.parse(tr.content); }catch(e){ issues.push(`[${loc}] itinerary: PARSE_FAIL`); } }
      if(baseItin.length>0 && locItin.length>0 && baseItin.length!==locItin.length) issues.push(`[${loc}] itinerary: STEP_COUNT_MISMATCH (DE=${baseItin.length}, ${loc}=${locItin.length})`);
      if(tr.content && loc!=='de'){
        const m=/(\bAbholung\b|\bAnkunft\b|\bBesuch\b|\bFahrt\b|\bMittagessen\b|\bRückfahrt\b|\bRücktransfer\b|\bFrühstück\b|\bAbendessen\b)/i;
        if(m.test(tr.content)) issues.push(`[${loc}] itinerary: GERMAN_TEXT_IN_CONTENT`);
      }
      const baseFaqs=Array.isArray(tour.faqs)?tour.faqs:[];
      const locFaqs=Array.isArray(tr.faqs)?tr.faqs:[];
      if(baseFaqs.length>0 && locFaqs.length>0 && baseFaqs.length!==locFaqs.length) issues.push(`[${loc}] faqs: FAQ_COUNT_MISMATCH (DE=${baseFaqs.length}, ${loc}=${locFaqs.length})`);
      if(tr.faqs && loc!=='de'){
        const str=JSON.stringify(tr.faqs);
        const m=str.match(/(\bAbholung\b|\bAnkunft\b|\bBesuch\b|\bFahrt\b|\bMittagessen\b|\bRückfahrt\b|\bFrühstück\b|\bbitte\b|\boder\b|\bund\b|\bist\b|\bein\b|\bder\b|\bdie\b|\bdas\b)/i);
        if(m){ const u=new Set(m.map(x=>x.toLowerCase())); if(u.size>2) issues.push(`[${loc}] faqs: GERMAN_TEXT_IN_FAQS (${[...u].slice(0,5).join(',')})`); }
      }
    }
    for (const loc of LOCALES) {
      const tr = trMap[tour.id]?.[loc]; if(!tr) continue;
      for (const f of ['highlights','included','not_included']) {
        const b=Array.isArray(tour[f])?tour[f]:[]; const l=Array.isArray(tr[f])?tr[f]:[];
        if(b.length>0 && l.length>0 && b.length!==l.length) issues.push(`[${loc}] ${f}: COUNT_MISMATCH (DE=${b.length}, ${loc}=${l.length})`);
      }
      if(tr.description && loc!=='de'){ const h=/(Teilnehmer|Fahrzeug|Preis pro Person|Teilnehmeranzahl)/i; if(h.test(tr.description)) issues.push(`[${loc}] description: GERMAN_TABLE_HEADERS`); }
    }
    if(issues.length){ total+=issues.length; reports.push({slug:tour.slug,issues}); }
  }
  console.log('=== FULL SIMULATED AUDIT (post-migration expectation, minus family-abendsafari rows) ===');
  for (const r of reports) { console.log(`\n### ${r.slug}`); for(const i of r.issues) console.log('   '+i); }
  console.log(`\n\nTours with issues: ${reports.length} | Total issues: ${total}`);
})();
