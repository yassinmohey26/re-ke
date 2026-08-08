require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const GA = '80dc4e17-ea30-4511-92be-5e8add77f139';
const LOCALES = ['en','ru','fr','hu','ar'];
const TIME_PATTERN = /\b(\d{1,2}:\d{2})\s*(Uhr|AM|PM|a\.m|p\.m|am|pm)\b/i;
const LOCATION_KEYWORDS = ['Red Sea','Rotes Meer','Красное море','Vörös-tenger','Mer Rouge','Hotel pickup'];

function isLoc(s){ if(!s) return false; if(TIME_PATTERN.test(s)) return false; if(LOCATION_KEYWORDS.some(k=>s.includes(k))) return true; if(s.trim()==='') return true; return false; }

(async () => {
  const { data: tours } = await db.from('tours').select('id,slug,meeting_point,duration,duration_hours,category_label');
  const { data: trs } = await db.from('content_translations').select('row_id,locale,duration,meeting_point,category_label').eq('table_name','tours');
  if (!tours || !trs) return;

  const trMap = {};
  for (const tr of trs) { (trMap[tr.row_id] = trMap[tr.row_id] || {})[tr.locale] = tr; }

  // Grand Aquarium category labels
  const aq = tours.find(t=>t.id===GA);
  console.log(`=== GRAND AQUARIUM ===`);
  console.log(`  base category_label(de) = "${aq?.category_label}"`);
  for (const loc of LOCALES) console.log(`  CT[${loc}] category_label = "${trMap[GA]?.[loc]?.category_label ?? '(missing row)'}"`);

  // Simulate audit AFTER migration for meeting_point
  console.log(`\n=== SIMULATED AUDIT AFTER MIGRATION (meeting_point/duration) ===`);
  let issues = 0;
  for (const t of tours) {
    for (const loc of LOCALES) {
      const tr = trMap[t.id]?.[loc];
      if (!tr) { console.log(`  [${t.slug}][${loc}] MISSING CT ROW`); issues++; continue; }
      // simulate migrated state
      const simDuration = null; // after migration
      if (simDuration !== null && TIME_PATTERN.test(simDuration)) { console.log(`  [${t.slug}][${loc}] DUR_TIME`); issues++; }
      // simulate CT meeting_point = template (for tours with slots) / location (no slots / 2-tages ru-fr-hu)
      const hasSlots = !['family-abendsafari-hurghada','hurghada-shopping-tour-basar-transfer'].includes(t.slug);
      const is2TagesRuFrHu = t.slug.includes('2-tages-ausflug') && ['ru','fr','hu'].includes(loc);
      const simMP = (hasSlots && !is2TagesRuFrHu) ? 'approx. {time}' : (t.slug==='2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben' && loc==='en') ? 'approx. {time}' : (['en','ru','fr','hu','ar'].includes(loc) && (t.slug==='family-abendsafari-hurghada'||t.slug==='hurghada-shopping-tour-basar-transfer')) ? 'Hurghada - Red Sea - Egypt' : null;
      if (simMP && isLoc(simMP) && t.meeting_point && TIME_PATTERN.test(t.meeting_point)) {
        console.log(`  [${t.slug}][${loc}] SIM_LOC_FLAG de="${t.meeting_point}"`);
        issues++;
      }
    }
  }
  console.log(`\n  Simulated issues: ${issues}`);
})();
