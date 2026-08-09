/* fix-ar-faq-lists.cjs
   Converts DRYRUN_AR_FAQ_LISTS.md (approved spec) into exact per-tour DB write operations
   for AR content_translations (faqs / highlights / included / not_included).

   Default mode: DRY RUN (writes nothing). Pass --execute to actually write.
   HARD RULE: do not run --execute unless Yassin posts explicit written approval for this batch.
*/
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const IS_DRY_RUN = !process.argv.includes('--execute');
const REPORT = path.join(__dirname, 'DRYRUN_AR_FAQ_LISTS.md');
const DUMP = path.join(__dirname, 'ar_dump.json');
const OUT = path.join(__dirname, 'DRYRUN_AR_FIX_SCRIPT_OUTPUT.md');

const NAECHTLICHE = 'naechtliche-stadtrundfahrt-durch-hurghada-private-tour';
const TOUR_2TAGES = '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben';
const SUPER_SAFARI = 'super-safari-hurghada';

// ---- report parsing (validated logic from _analyze-report.cjs) ----
const c = fs.readFileSync(REPORT, 'utf8');
const lines = c.split('\n');

function splitRow(l) {
  const t = l.trim();
  if (!t.startsWith('|') || !t.endsWith('|')) return null;
  const inner = t.slice(1, -1);
  return inner.split('|').map(s => s.trim());
}
function sectionType(header) {
  if (/^### FAQs/.test(header)) return 'faqs';
  if (/^### Highlights/.test(header)) return 'highlights';
  if (/^### Included/.test(header)) return 'included';
  if (/^### Not included/.test(header)) return 'not_included';
  return null;
}
function parseCurQ(arCell) {
  if (!arCell || arCell === '(none)') return '';
  if (arCell.startsWith('(covered')) return '';
  const arrow = arCell.indexOf('→');
  return arrow >= 0 ? arCell.slice(0, arrow).trim() : arCell.trim();
}
function parseProposed(p) {
  const t = (p || '').trim();
  const m = t.match(/^"([^"]+)"\s*→\s*"([^"]*)"$/);
  if (m) return { q: m[1], a: m[2] };
  const m2 = t.match(/^([^→"]+)\s*→\s*"([^"]*)"$/);
  if (m2) return { q: m2[1].replace(/^"|"$/g, '').trim(), a: m2[2] };
  return { q: null, a: t.replace(/^"|"$/g, '') };
}
function cleanProp(p) {
  const t = (p || '').trim();
  if (/^keep/.test(t)) return '';
  return t.replace(/^"|"$/g, '');
}
function stripNote(cell) {
  let t = (cell || '').trim();
  const idx = t.search(/ - (\*\*[A-Z]+\*\*|OK|partial|\(covered)/);
  if (idx >= 0) t = t.slice(0, idx).trim();
  return t;
}

const tours = [];
let cur = null;
let curSection = null;
let inFabricated = false;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const m = l.match(/^## Tour: `([^`]+)`/);
  if (m) {
    cur = { slug: m[1], faqs: [], list: { highlights: [], included: [], not_included: [] } };
    tours.push(cur);
    curSection = null; inFabricated = false;
    continue;
  }
  if (!cur) continue;
  const h = l.match(/^### (FAQs|Highlights|Included|Not included)\b/);
  if (h) { curSection = sectionType(l); inFabricated = false; continue; }
  if (/^\*\*Fabricated/.test(l)) { inFabricated = true; continue; }
  const row = splitRow(l);
  if (!row) continue;
  if (row.length === 1 && row[0].replace(/-+/g, '') === '') continue;
  if (curSection === 'faqs') {
    if (row[0] === '#' || row[1] === 'DE Q') continue;
    if (inFabricated) {
      if (row[0] === 'AR Q' || row[1] === 'AR A') continue;
      if (/^[-]+$/.test(row[0]) && row[1] && /^[-]+$/.test(row[1])) continue;
      cur.faqs.push({ op: 'remove', q: row[0], a: row[1] });
      continue;
    }
    const [num, deq, arCell, status, proposed] = row;
    if (/D\d+/.test(num)) {
      const s = status || '';
      const p = proposed || '';
      if (/MISSING/.test(s)) {
        const qa = parseProposed(p);
        cur.faqs.push({ op: 'add', deq, q: qa.q, a: qa.a });
      } else if (/WRONG|SUBSTITUTED|CORRUPTED/.test(s)) {
        const qa = parseProposed(p);
        cur.faqs.push({ op: 'replace', deq, curQ: parseCurQ(arCell), q: qa.q, a: qa.a, note: s });
      } else if (p.trim() && !/^keep/.test(p.trim())) {
        const qa = parseProposed(p);
        cur.faqs.push({ op: 'replace', deq, curQ: parseCurQ(arCell), q: qa.q, a: qa.a, note: s });
      }
    }
  } else if (curSection) {
    if (row[1] === 'Current AR / status' || row[0] === 'DE item') continue;
    const [deItem, curCell, proposed] = row;
    const st = (() => {
      const t = (curCell || '').trim();
      if (/^\*\*MISSING\*\*/.test(t)) return 'missing';
      if (/\*\*FABRICATED\*\*/.test(t)) return 'fabricated';
      if (/^\(covered/.test(t)) return 'covered';
      if (/\*\*WRONG\*\*|\*\*SUBSTITUTED\*\*|\*\*CORRUPTED\*\*|partial/.test(t)) return 'replace';
      return 'ok';
    })();
    if (st === 'ok' || st === 'covered') continue;
    if (st === 'missing') { cur.list[curSection].push({ op: 'add', deItem, value: cleanProp(proposed) }); continue; }
    if (st === 'fabricated') { cur.list[curSection].push({ op: 'remove', deItem, value: stripNote(curCell) }); continue; }
    cur.list[curSection].push({ op: 'replace', deItem, value: cleanProp(proposed), cur: stripNote(curCell) });
  }
}

// ---- user-approved special resolutions ----
// A) naechtliche highlights: complete replacement with the 4 prose blocks split at " – " into 8 entries.
const NAECHTLICHE_BLOCKS = [
  'مارينا الغردقة – وجهة نابضة بالحياة من أجمل مرافئ البحر الأحمر. ليلاً تتحول أضواء القوارب إلى عرض ملون، ومكان مثالي للتصوير وأول انطباع عن الحياة الليلية في الغردقة.',
  'سوق الخضار والفواكه التقليدي – هنا يبدأ الغردقة الحقيقي: لقاء السكان المحليين وأجواء المساومة والأصوات والروائح، بعيداً عن مناطق السياح.',
  'سوق السمك والمسجد الكبير – نمر على سوق السمك ونصل إلى المسجد الكبير الذي يتألق بأضوائه الدافئة مساءً، مع مناظر معمارية رائعة.',
  'تجربة مقهى مصري أصيل – في الختام تستمتع بشاي نعناع تقليدي أو قهوة عربية في مقهى محلي، لحظة هادئة تكمل الجولة بشكل مثالي.',
];
const naechtlicheHighlights = [];
for (const block of NAECHTLICHE_BLOCKS) {
  const sep = block.indexOf(' – ');
  if (sep < 0) throw new Error('naechtliche block missing " – " separator: ' + block);
  naechtlicheHighlights.push({ title: block.slice(0, sep), desc: block.slice(sep + 3) });
}
const nt = tours.find(t => t.slug === NAECHTLICHE);
if (nt) {
  nt.list.highlights = [{ op: 'replaceAll', value: naechtlicheHighlights.flatMap(h => [h.title, h.desc]) }];
}

// B) 2-tages not_included: the 2 consolidated FABRICATED rows expand to 5 exact dump items.
const EXPAND_2TAGES = [
  'رسوم نقل إضافية من مرسى علم: 50 يورو للفرد',
  'رسوم نقل إضافية من القصير: 35 يورو للفرد',
  'رسوم نقل إضافية من خليج Макادي وسهل الحشيش: 5 يورو للفرد',
  'رسوم نقل إضافية من الجونة وسفاجا وسماء باي: 10 يورو للفرد',
  'مرشد سياحي بلغة أجنبية (إنجليزي أو روسي أو فرنسي): إضافي 10 يورو للفرد',
];
const t2 = tours.find(t => t.slug === TOUR_2TAGES);
if (t2) {
  t2.list.not_included = t2.list.not_included
    .filter(o => o.op !== 'remove')
    .concat(EXPAND_2TAGES.map(v => ({ op: 'remove', deItem: '(none)', value: v })));
}

// C) super-safari included: retarget Abendshow replace to the real included item.
const ss = tours.find(t => t.slug === SUPER_SAFARI);
if (ss) {
  ss.list.included = ss.list.included.map(o => {
    if (o.op === 'replace' && o.cur === 'عرض الفلاحة البدوية (الرقص والموسيقى)') {
      return { ...o, cur: 'عرض الفلاحة البدوية' };
    }
    return o;
  });
}

// D) leftover FAQ-answer inconsistencies (scan of all 19 tours, same pattern as the user-found case):
//    1. super-safari "ما الفعاليات المشمولة؟": answer lists swimming / farm show / stargazing,
//       all removed as FABRICATED from this tour's highlights/included. Question has no DE FAQ
//       counterpart (closest is D1 "Was ist die Super Safari Hurghada?"). Align answer with the
//       approved included after-state (Quad, Kamelritt, Spider-Buggy, Jeep-Safari, Beduinendorf,
//       BBQ-Abendessen, Softdrinks, Abendshow/العرض الشرقي).
//    2. 2-tages "هل الوجبات مشمولة أثناء الرحلة؟" (kept as OK in report): answer claims lunch on
//       both days, but DE includes only "Mittagessen am ersten Tag" (batch removes "وجبتا غداء
//       مشمولة" from highlights as fabricated; included corrected to "غداء في اليوم الأول").
const SUPER_SAFARI_FAQ_ACTIVITIES = 'تشمل الفعاليات ركوب الدراجات النارية (كواد)، ركوب الإبل، رحلة بسيارة سبايدر باجي، جيب سفاري، زيارة القرية البدوية، عشاء شواء تقليدي، مشروبات خفيفة، والعرض الشرقي.';
const TWO_DAYS_FAQ_MEALS = 'نعم، يشمل البرنامج وجبة غداء في اليوم الأول وإفطاراً في الفندق. وجبة العشاء غير مشمولة.';
if (ss) {
  ss.faqs.push({
    op: 'replace', deq: '(kept AR row – no exact DE FAQ counterpart; D1 covers activities)',
    curQ: 'ما الفعاليات المشمولة؟', q: null, a: SUPER_SAFARI_FAQ_ACTIVITIES,
    note: 'leftover: answer referenced fabricated swimming/farm show/stargazing',
  });
}
if (t2) {
  t2.faqs.push({
    op: 'replace', deq: 'D6 Sind Mahlzeiten inbegriffen?',
    curQ: 'هل الوجبات مشمولة أثناء الرحلة؟', q: null, a: TWO_DAYS_FAQ_MEALS,
    note: 'leftover: answer claimed lunch on both days; DE includes day-1 lunch only',
  });
}

// ---- load live DB state (read-only) ----
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tourRows } = await db.from('tours').select('id, slug, name, faqs');
  const { data: arRows } = await db
    .from('content_translations')
    .select('id, row_id, name, faqs, highlights, included, not_included')
    .eq('table_name', 'tours')
    .eq('locale', 'ar');
  if (!Array.isArray(tourRows) || !Array.isArray(arRows)) throw new Error('DB read failed');

  const arByRow = new Map(arRows.map(r => [r.row_id, r]));
  const slugToTour = new Map(tourRows.map(t => [t.slug, t]));

  // cross-check live state vs ar_dump.json (INFO only; live is ground truth)
  let dump = null;
  if (fs.existsSync(DUMP)) dump = JSON.parse(fs.readFileSync(DUMP, 'utf8'));
  const diffNotes = [];
  if (dump) {
    for (const d of dump) {
      const tt = slugToTour.get(d.slug);
      const live = tt ? arByRow.get(tt.id) : null;
      if (!tt || !live) { diffNotes.push(`dump row has no live AR row: ${d.slug}`); continue; }
      for (const f of ['faqs', 'highlights', 'included', 'not_included']) {
        const a = JSON.stringify(d.ar[f] || null);
        const b = JSON.stringify(live[f] || null);
        if (a !== b) diffNotes.push(`live differs from ar_dump.json [${d.slug}].${f}`);
      }
    }
  }

  // ---- apply ops -> before/after ----
  const report = [];
  const blockers = [];
  const counts = { faqs: { add: 0, remove: 0, replace: 0 }, highlights: { add: 0, remove: 0, replace: 0 }, included: { add: 0, remove: 0, replace: 0 }, not_included: { add: 0, remove: 0, replace: 0 } };
  const FIELD_KEYS = ['faqs', 'highlights', 'included', 'not_included'];

  const findFaq = (arr, q) => arr.findIndex(f => f.question === q);
  const findList = (arr, v) => arr.indexOf(v);

  for (const t of tours) {
    const tt = slugToTour.get(t.slug);
    if (!tt) { blockers.push(`NO TOUR ROW for slug: ${t.slug}`); continue; }
    const ct = arByRow.get(tt.id);
    if (!ct) { blockers.push(`NO AR content_translations row for: ${t.slug} (row_id ${tt.id})`); continue; }

    const entry = { slug: t.slug, name: tt.name || ct.name, rowId: tt.id, ctId: ct.id, fields: [] };

    // faqs
    const faqOps = t.faqs;
    if (faqOps.length) {
      const before = JSON.parse(JSON.stringify(ct.faqs || []));
      const after = JSON.parse(JSON.stringify(before));
      const fBlockers = [];
      const fCounts = { add: 0, remove: 0, replace: 0 };
      for (const o of faqOps) {
        if (o.op === 'add') {
          if (!o.q) { fBlockers.push(`FAQ ADD missing question [${t.slug}] deq=${o.deq}`); continue; }
          if (findFaq(after, o.q) >= 0) fBlockers.push(`FAQ ADD duplicate question [${t.slug}]: "${o.q}"`);
          after.push({ question: o.q, answer: o.a || '' });
          fCounts.add++;
        } else if (o.op === 'replace') {
          const idx = findFaq(after, o.curQ);
          if (idx < 0) { fBlockers.push(`FAQ REPLACE no match [${t.slug}] curQ="${o.curQ}"`); continue; }
          after[idx].question = o.q || after[idx].question;
          after[idx].answer = o.a || '';
          fCounts.replace++;
        } else if (o.op === 'remove') {
          const idx = findFaq(after, o.q);
          if (idx < 0) { fBlockers.push(`FAQ REMOVE no match [${t.slug}] q="${o.q}"`); continue; }
          after.splice(idx, 1);
          fCounts.remove++;
        }
      }
      if (fBlockers.length) {
        blockers.push(...fBlockers);
      } else if (JSON.stringify(before) !== JSON.stringify(after)) {
        for (const k of Object.keys(fCounts)) counts.faqs[k] += fCounts[k];
        entry.fields.push({ field: 'faqs', before, after, ops: faqOps.length });
      }
    }

    // list fields
    for (const f of ['highlights', 'included', 'not_included']) {
      const ops = t.list[f];
      if (!ops.length) continue;
      const before = JSON.parse(JSON.stringify(ct[f] || []));
      const after = JSON.parse(JSON.stringify(before));
      const lBlockers = [];
      const lCounts = { add: 0, remove: 0, replace: 0 };
      for (const o of ops) {
        if (o.op === 'replaceAll') {
          after.length = 0;
          after.push(...o.value);
          lCounts.remove += before.length;
          lCounts.add += o.value.length;
        } else if (o.op === 'add') {
          after.push(o.value);
          lCounts.add++;
        } else if (o.op === 'replace') {
          const idx = findList(after, o.cur);
          if (idx < 0) { lBlockers.push(`LIST REPLACE no match [${t.slug}].${f}: "${o.cur}"`); continue; }
          after[idx] = o.value;
          lCounts.replace++;
        } else if (o.op === 'remove') {
          const idx = findList(after, o.value);
          if (idx < 0) { lBlockers.push(`LIST REMOVE no match [${t.slug}].${f}: "${o.value}"`); continue; }
          after.splice(idx, 1);
          lCounts.remove++;
        }
      }
      if (lBlockers.length) {
        blockers.push(...lBlockers);
      } else if (JSON.stringify(before) !== JSON.stringify(after)) {
        for (const k of Object.keys(lCounts)) counts[f][k] += lCounts[k];
        entry.fields.push({ field: f, before, after, ops: ops.length });
      }
    }

    if (entry.fields.length) report.push(entry);
  }

  // ---- corruption cleanup evidence ----
  const CORRUPTIONS = ['الكORNISH', 'מתנות', 'couples', 'uitable', 'نموذاجاً'];
  const remaining = [];
  for (const e of report) {
    for (const fld of e.fields) {
      const arr = fld.after;
      for (const token of CORRUPTIONS) {
        for (const item of arr) {
          const s = typeof item === 'string' ? item : (item.question || '') + ' ' + (item.answer || '');
          if (s.includes(token)) remaining.push(`${token} in [${e.slug}].${fld.field}`);
        }
      }
    }
  }

  // ---- write dry-run report ----
  const esc = s => JSON.stringify(s);
  const totalRows = report.reduce((n, e) => n + e.fields.length, 0);
  const grand = { add: 0, remove: 0, replace: 0 };
  for (const f of FIELD_KEYS) for (const k of Object.keys(grand)) grand[k] += counts[f][k];

  const md = [];
  md.push('# Dry-run output: AR FAQ + list fixes');
  md.push('');
  md.push(`- Generated: ${new Date().toISOString()}`);
  md.push(`- Mode: **DRY RUN** — no database writes performed.`);
  md.push(`- Source of truth: \`scripts/DRYRUN_AR_FAQ_LISTS.md\` (approved spec, tables + naechtliche prose + 3 user resolutions).`);
  md.push(`- HARD RULE: do NOT run this script with \`--execute\` without Yassin's explicit written approval for this exact batch.`);
  md.push('');
  md.push('## Count summary');
  md.push('');
  md.push('| Field | Adds | Removes | Replaces | Total |');
  md.push('|---|---|---|---|---|');
  for (const f of FIELD_KEYS) {
    md.push(`| ${f} | ${counts[f].add} | ${counts[f].remove} | ${counts[f].replace} | ${counts[f].add + counts[f].remove + counts[f].replace} |`);
  }
  md.push(`| **Total** | **${grand.add}** | **${grand.remove}** | **${grand.replace}** | **${grand.add + grand.remove + grand.replace}** |`);
  md.push('');
  md.push(`**Note:** these are the actual table-derived counts. They differ from the report summary's 78/41/52 and 195 (87/46/62) per the approved "use the tables" decision (naechtliche highlights prose = 8 adds + 6 removes; 2-tages not_included expansion = 5 removes; super-safari Abendshow retargeted).`);
  md.push('');
  md.push(`## Scope`);
  md.push('');
  md.push(`- Tours with write operations: ${report.length}`);
  md.push(`- Total field updates emitted: ${totalRows}`);
  md.push(`- Clean tours (no ops): ${tours.filter(t => !report.some(e => e.slug === t.slug)).length}`);
  md.push('');
  md.push('## Blockers / issues');
  md.push('');
  if (blockers.length) {
    blockers.forEach(b => md.push(`- **BLOCKER:** ${b}`));
  } else {
    md.push('- none');
  }
  md.push('');
  md.push('## Live-state vs ar_dump.json cross-check');
  md.push('');
  if (diffNotes.length) {
    diffNotes.forEach(n => md.push(`- INFO: ${n}`));
  } else {
    md.push('- identical (live AR state matches ar_dump.json)');
  }
  md.push('');
  md.push('## Corruption cleanup evidence');
  md.push('');
  md.push('Checked after-states for: `' + CORRUPTIONS.join('`, `') + '`');
  if (remaining.length) {
    remaining.forEach(r => md.push(`- **REMAINS:** ${r}`));
  } else {
    md.push('- All corruption tokens are absent from every after-state.');
  }
  md.push('');
  md.push('## Per-tour write plan');
  md.push('');
  for (const e of report) {
    md.push(`### Tour: \`${e.slug}\``);
    md.push(`Name: ${e.name}`);
    md.push(`row_id: ${e.rowId}`);
    md.push(`content_translations.id: ${e.ctId}`);
    md.push('');
    for (const fld of e.fields) {
      const afterJson = esc(fld.after);
      md.push(`#### ${fld.field} — ${fld.ops} ops`);
      md.push('');
      md.push('```sql');
      md.push(`UPDATE content_translations SET ${fld.field} = ${afterJson}, updated_at = now() WHERE id = '${e.ctId}' AND row_id = '${e.rowId}' AND table_name = 'tours' AND locale = 'ar';`);
      md.push('```');
      md.push('');
      md.push('```js');
      md.push(`db.from('content_translations').update({ ${fld.field}: ${afterJson} }).eq('id', '${e.ctId}');`);
      md.push('```');
      md.push('');
      md.push('BEFORE:');
      md.push('```json');
      md.push(JSON.stringify(fld.before, null, 1));
      md.push('```');
      md.push('');
      md.push('AFTER:');
      md.push('```json');
      md.push(JSON.stringify(fld.after, null, 1));
      md.push('```');
      md.push('');
    }
  }
  md.push('## End');
  fs.writeFileSync(OUT, md.join('\n'));

  console.log('Mode: ' + (IS_DRY_RUN ? 'DRY RUN' : 'EXECUTE'));
  console.log('Field updates: ' + totalRows + ' across ' + report.length + ' tours');
  console.log('Blockers: ' + blockers.length);
  console.log('Counts: ' + FIELD_KEYS.map(f => `${f} ${counts[f].add}/${counts[f].remove}/${counts[f].replace}`).join(', '));
  console.log('Grand total ops: ' + (grand.add + grand.remove + grand.replace));
  console.log('Output: ' + OUT);
  if (!IS_DRY_RUN) {
    if (blockers.length) {
      console.error('ABORTING EXECUTE: ' + blockers.length + ' blocker(s) present. No writes performed.');
      process.exit(1);
    }
    const perTour = [];
    for (const e of report) {
      const fields = [];
      for (const fld of e.fields) {
        const { error } = await db
          .from('content_translations')
          .update({ [fld.field]: fld.after })
          .eq('id', e.ctId);
        if (error) throw new Error(`UPDATE failed [${e.slug}].${fld.field}: ${error.message}`);
        fields.push(fld.field);
      }
      perTour.push(`${e.slug} | row_id=${e.rowId} | ct_id=${e.ctId} | ${fields.length} field(s): ${fields.join(', ')}`);
    }
    console.log('=== EXECUTE complete ===');
    for (const line of perTour) console.log(line);
    console.log('Total: ' + report.length + ' tours, ' + totalRows + ' fields updated.');
  }
})().catch(err => { console.error(err); process.exit(1); });
