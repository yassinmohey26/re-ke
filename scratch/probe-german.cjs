require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALES = ['en', 'ar', 'ru', 'fr', 'hu'];
const TARGETS = ['family-safari-hurghada', 'mega-safari-hurghada'];

// High-precision German markers
const GERMAN_WORDS = /\b(Ausflug|Ausflüge|Fahrt|Abholung|Rücktransfer|Rückfahrt|Stunde|Stunden|Tagesausflug|Halbtagesausflug|Wüste|Wüstensafari|Wüstenabenteuer|Beduinendorf|Beduinen|Mittagessen|Abendessen|Frühstück|Sightseeing|Stadtrundfahrt|Schnorchelausflug|Schnorcheln|Kamelritt|Aegypten|Ägypten|Ägyptische|Inseltrip|Inselausflug|Tour\b|Touren|Privat|Privater|Privates|Besuch|Nächtliche|Abendsafari|Wassersport|Transfer\b|Hotel\b|Der|Die|Das|Und|Mit|Für|Von|ab\b|inklusive|erleben|Erleben|Entdecke|Authentische|authentische|Glasbodenboot|Pyramiden-Ausflug)\b/i;
const GERMAN_CHARS = /[ßäöüÄÖÜ]/;

function hasGerman(text) {
  if (!text) return false;
  if (GERMAN_CHARS.test(text)) return true;
  return GERMAN_WORDS.test(text);
}
function scanArr(arr) { return Array.isArray(arr) ? arr.filter(hasGerman) : []; }

(async () => {
  const { data: tours } = await db.from('tours').select('id,slug,name,short_description,description,highlights,included,not_included,faqs,category_label');
  const { data: trs } = await db.from('content_translations').select('*').eq('table_name', 'tours');
  if (!tours || !trs) return;
  const byId = {}; for (const t of tours) byId[t.id] = t;
  const trMap = {}; for (const tr of trs) (trMap[tr.row_id] = trMap[tr.row_id] || {})[tr.locale] = tr;

  const FIELDS = ['name', 'short_description', 'highlights', 'included', 'not_included', 'faqs', 'category_label', 'description'];

  // ---- TARGET TOURS: full dump ----
  console.log('========== TARGET TOURS (family-safari, mega-safari) — ALL non-DE locales ==========');
  for (const t of tours.filter(x => TARGETS.includes(x.slug))) {
    console.log(`\n### ${t.slug}\n  BASE name: "${t.name}"`);
    for (const loc of LOCALES) {
      const tr = trMap[t.id]?.[loc];
      if (!tr) { console.log(`  [${loc}] NO ROW`); continue; }
      console.log(`  [${loc}]`);
      for (const f of FIELDS) {
        const v = tr[f];
        if (Array.isArray(v)) {
          const germ = scanArr(v);
          console.log(`    ${f}: ${v.length} items${germ.length ? '  ⚠️ GERMAN: ' + JSON.stringify(germ.slice(0, 3)) : ''}`);
        } else if (typeof v === 'string') {
          const g = hasGerman(v) ? '  ⚠️ GERMAN' : '';
          console.log(`    ${f}: ${JSON.stringify(v.slice(0, 120))}${g}`);
        } else {
          console.log(`    ${f}: ${JSON.stringify(v)}`);
        }
      }
      // faqs nested
      if (Array.isArray(tr.faqs)) {
        const germQ = tr.faqs.filter(f => f?.question && hasGerman(f.question)).map(f => f.question);
        const germA = tr.faqs.filter(f => f?.answer && hasGerman(f.answer)).map(f => f.answer);
        if (germQ.length || germA.length) console.log(`    faqs: ⚠️ GERMAN q=${germQ.length} a=${germA.length} e.g. ${JSON.stringify((germQ[0]||germA[0]||'').slice(0,80))}`);
      }
    }
  }

  // ---- FULL AUDIT ----
  console.log('\n\n========== FULL AUDIT: German content in non-DE locales (all 29 tours) ==========');
  let flagged = 0;
  const report = [];
  for (const t of tours) {
    const per = [];
    for (const loc of LOCALES) {
      const tr = trMap[t.id]?.[loc];
      if (!tr) { per.push(`${loc}:(NO ROW)`); continue; }
      const hits = [];
      if (hasGerman(tr.name)) hits.push('name');
      if (hasGerman(tr.short_description)) hits.push('short_description');
      if (hasGerman(tr.category_label)) hits.push('category_label');
      if (scanArr(tr.highlights).length) hits.push('highlights');
      if (scanArr(tr.included).length) hits.push('included');
      if (scanArr(tr.not_included).length) hits.push('not_included');
      if (tr.faqs?.some(f => (f?.question && hasGerman(f.question)) || (f?.answer && hasGerman(f.answer)))) hits.push('faqs');
      if (typeof tr.description === 'string' && hasGerman(tr.description)) hits.push('description');
      if (typeof tr.content === 'string' && hasGerman(tr.content)) hits.push('itinerary');
      if (hits.length) { per.push(`${loc}:GERMAN[${hits.join(',')}]`); flagged++; }
    }
    if (per.some(p => p.includes('GERMAN') || p.includes('NO ROW'))) {
      report.push({ slug: t.slug, lines: per });
    }
  }
  for (const r of report) console.log(`  ${r.slug}\n    ${r.lines.join(' | ')}`);
  console.log(`\nTours flagged: ${report.length} | locale×tour combinations: ${flagged}`);
})();
