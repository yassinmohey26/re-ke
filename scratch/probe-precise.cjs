require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALES = ['en', 'ar', 'ru', 'fr', 'hu'];

function isEmpty(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  return false;
}
function clean(s) { return String(s ?? '').replace(/\s+/g, ' ').trim(); }
function isCopy(a, b) { return clean(a) === clean(b); }
const GERMAN_CHARS = /[ßäÄ]/; // unambiguous German letters (Hungarian has ö/ü, but not ä/ß)

function arrFlags(locArr, deArr) {
  const out = [];
  if (isEmpty(locArr)) return ['EMPTY'];
  if (deArr.length === locArr.length && locArr.every((v, i) => isCopy(v, deArr[i]))) return ['COPY_OF_DE'];
  locArr.forEach((v, i) => {
    if (GERMAN_CHARS.test(v)) out.push(`ITEM_${i}_HAS_Ä/ß:${JSON.stringify(v.slice(0, 60))}`);
    else if (deArr[i] && isCopy(v, deArr[i])) out.push(`ITEM_${i}_=DE`);
  });
  return out.length ? out : [];
}

(async () => {
  const { data: tours } = await db.from('tours').select('*');
  const { data: trs } = await db.from('content_translations').select('*').eq('table_name', 'tours');
  if (!tours || !trs) return;
  const byId = {}; for (const t of tours) byId[t.id] = t;
  const trMap = {}; for (const tr of trs) (trMap[tr.row_id] = trMap[tr.row_id] || {})[tr.locale] = tr;

  const report = [];
  let totalCombos = 0;

  for (const t of tours) {
    const perLocale = [];
    for (const loc of LOCALES) {
      const tr = trMap[t.id]?.[loc];
      if (!tr) { perLocale.push(`[${loc}] NO_ROW`); totalCombos++; continue; }
      const flags = [];
      const strings = [
        ['name', tr.name, t.name],
        ['short_description', tr.short_description, t.short_description],
        ['category_label', tr.category_label, t.category_label],
      ];
      for (const [f, lv, dv] of strings) {
        if (isEmpty(lv)) flags.push(`${f}=EMPTY`);
        else if (GERMAN_CHARS.test(lv)) flags.push(`${f}=GERMAN_Ä/ß`);
        else if (isCopy(lv, dv)) flags.push(`${f}=COPY_DE`);
      }
      if (typeof tr.description === 'string') {
        if (isEmpty(tr.description)) flags.push('description=EMPTY');
        else if (GERMAN_CHARS.test(tr.description)) flags.push('description=GERMAN_Ä/ß');
      }
      if (typeof tr.content === 'string' && GERMAN_CHARS.test(tr.content)) flags.push('itinerary=GERMAN_Ä/ß');
      flags.push(...arrFlags(tr.highlights, t.highlights).map(x => `highlights:${x}`));
      flags.push(...arrFlags(tr.included, t.included).map(x => `included:${x}`));
      flags.push(...arrFlags(tr.not_included, t.not_included).map(x => `not_included:${x}`));
      if (Array.isArray(tr.faqs)) {
        const deFaqs = Array.isArray(t.faqs) ? t.faqs : [];
        if (isEmpty(tr.faqs)) flags.push('faqs=EMPTY');
        else {
          tr.faqs.forEach((f, i) => {
            const d = deFaqs[i];
            if (f?.question && (GERMAN_CHARS.test(f.question) || (d && isCopy(f.question, d.question)))) flags.push(`faqs[${i}].question=DE/Äß`);
            if (f?.answer && GERMAN_CHARS.test(f.answer)) flags.push(`faqs[${i}].answer=Äß`);
          });
        }
      }
      if (flags.length) { perLocale.push(`[${loc}] ${flags.join('; ')}`); totalCombos++; }
    }
    if (perLocale.length) report.push({ slug: t.slug, lines: perLocale });
  }

  console.log('=== PRECISE AUDIT: empty / copied-from-DE / German-Äß content in non-DE locales ===');
  for (const r of report) { console.log(`\n${r.slug}`); for (const l of r.lines) console.log(`   ${l}`); }
  console.log(`\nTours with issues: ${report.length} | locale×tour combos: ${totalCombos}`);
})();
