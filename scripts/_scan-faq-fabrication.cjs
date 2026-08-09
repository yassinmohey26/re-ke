/* READ-ONLY: check super-safari FAQ "ما الفعاليات المشمولة؟" vs DE FAQ source,
   and scan all 19 report tours for FAQ answers referencing content removed
   elsewhere in the same tour (highlights/included/not_included / fabricated FAQs). */
const fs = require('fs');
const dump = JSON.parse(fs.readFileSync('scripts/ar_dump.json', 'utf8'));
const lines = fs.readFileSync('scripts/DRYRUN_AR_FAQ_LISTS.md', 'utf8').split('\n');

const out = [];

function splitRow(l) {
  const t = l.trim();
  if (!t.startsWith('|') || !t.endsWith('|')) return null;
  return t.slice(1, -1).split('|').map(s => s.trim());
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

// ---- parse report ops ----
const tours = [];
let cur = null, curSection = null, inFabricated = false;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const m = l.match(/^## Tour: `([^`]+)`/);
  if (m) { cur = { slug: m[1], faqs: [], list: { highlights: [], included: [], not_included: [] } }; tours.push(cur); curSection = null; inFabricated = false; continue; }
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
      const s = status || '', p = proposed || '';
      if (/MISSING/.test(s)) {
        const qa = (() => { const t = p.trim(); const mm = t.match(/^"([^"]+)"\s*→\s*"([^"]*)"$/); if (mm) return { q: mm[1], a: mm[2] }; const m2 = t.match(/^([^→"]+)\s*→\s*"([^"]*)"$/); if (m2) return { q: m2[1].replace(/^"|"$/g, '').trim(), a: m2[2] }; return { q: null, a: t.replace(/^"|"$/g, '') }; })();
        cur.faqs.push({ op: 'add', deq, q: qa.q, a: qa.a });
      } else if (/WRONG|SUBSTITUTED|CORRUPTED/.test(s)) {
        const qa = (() => { const t = p.trim(); const mm = t.match(/^"([^"]+)"\s*→\s*"([^"]*)"$/); if (mm) return { q: mm[1], a: mm[2] }; const m2 = t.match(/^([^→"]+)\s*→\s*"([^"]*)"$/); if (m2) return { q: m2[1].replace(/^"|"$/g, '').trim(), a: m2[2] }; return { q: null, a: t.replace(/^"|"$/g, '') }; })();
        cur.faqs.push({ op: 'replace', deq, curQ: parseCurQ(arCell), q: qa.q, a: qa.a, note: s });
      } else if (p.trim() && !/^keep/.test(p.trim())) {
        const qa = (() => { const t = p.trim(); const mm = t.match(/^"([^"]+)"\s*→\s*"([^"]*)"$/); if (mm) return { q: mm[1], a: mm[2] }; const m2 = t.match(/^([^→"]+)\s*→\s*"([^"]*)"$/); if (m2) return { q: m2[1].replace(/^"|"$/g, '').trim(), a: m2[2] }; return { q: null, a: t.replace(/^"|"$/g, '') }; })();
        cur.faqs.push({ op: 'replace', deq, curQ: parseCurQ(arCell), q: qa.q, a: qa.a, note: s });
      }
    }
  } else if (curSection) {
    if (row[1] === 'Current AR / status' || row[0] === 'DE item') continue;
    const [deItem, curCell, proposed] = row;
    const t = (curCell || '').trim();
    const st = /^\*\*MISSING\*\*/.test(t) ? 'missing' : /\*\*FABRICATED\*\*/.test(t) ? 'fabricated' : /^\(covered/.test(t) ? 'covered' : (/\*\*WRONG\*\*|\*\*SUBSTITUTED\*\*|\*\*CORRUPTED\*\*|partial/.test(t)) ? 'replace' : 'ok';
    if (st === 'ok' || st === 'covered') continue;
    if (st === 'missing') { cur.list[curSection].push({ op: 'add', deItem, value: cleanProp(proposed) }); continue; }
    if (st === 'fabricated') { cur.list[curSection].push({ op: 'remove', deItem, value: stripNote(curCell) }); continue; }
    cur.list[curSection].push({ op: 'replace', deItem, value: cleanProp(proposed), cur: stripNote(curCell) });
  }
}

// ---- 1. super-safari DE FAQ source check ----
const ssDump = dump.find(d => d.slug.includes('super-safari'));
const ssOps = tours.find(t => t.slug.includes('super-safari'));
out.push('=== super-safari DE FAQ questions (tours.faqs) ===');
(ssDump.de.faqs || []).forEach((f, i) => out.push((i + 1) + '. ' + f.question));
out.push('');
out.push('=== super-safari AR FAQ before (ar.faqs) ===');
(ssDump.ar.faqs || []).forEach((f, i) => out.push((i + 1) + '. Q: ' + f.question + '\n   A: ' + f.answer));
out.push('');
out.push('=== super-safari AR FAQ ops from report ===');
ssOps.faqs.forEach(o => out.push(JSON.stringify(o)));
out.push('');
out.push('=== super-safari AR highlights/included/not_included removes ===');
for (const f of ['highlights', 'included', 'not_included']) {
  ssOps.list[f].filter(o => o.op === 'remove').forEach(o => out.push(f + ' REMOVE: ' + JSON.stringify(o.value)));
}
out.push('');

// ---- 2. cross-tour scan ----
out.push('=== SCAN: FAQ answers referencing removed content (same tour) ===');
out.push('');
const candidates = [];
for (const t of tours) {
  const d = dump.find(x => x.slug === t.slug);
  if (!d) continue;
  const removed = [];
  for (const f of ['highlights', 'included', 'not_included']) {
    t.list[f].filter(o => o.op === 'remove').forEach(o => removed.push(f + '|' + o.value));
  }
  t.faqs.filter(o => o.op === 'remove').forEach(o => removed.push('faq-remove|' + o.q + ' — ' + o.a));
  if (!removed.length) continue;
  // scan all AR FAQ entries (before state = untouched entries; the kept ones are the risk)
  const arFaqs = d.ar.faqs || [];
  for (const f of arFaqs) {
    const q = f.question || '';
    const a = f.answer || '';
    for (const r of removed) {
      const [, rv] = r.split('|');
      if (!rv) continue;
      if (rv.length >= 6 && a.includes(rv)) {
        candidates.push({ tour: t.slug, question: q, match: 'answer CONTAINS removed: ' + rv, answer: a });
      } else if (a.length >= 6 && rv.includes(a)) {
        candidates.push({ tour: t.slug, question: q, match: 'removed CONTAINS answer: ' + a + '  (removed=' + rv + ')', answer: a });
      }
      if (rv.length >= 6 && q.includes(rv)) {
        candidates.push({ tour: t.slug, question: q, match: 'question CONTAINS removed: ' + rv, answer: a });
      }
    }
  }
}
if (!candidates.length) out.push('none');
for (const c of candidates) {
  out.push('- [' + c.tour + '] Q: ' + c.question);
  out.push('  A: ' + c.answer);
  out.push('  -> ' + c.match);
}

fs.writeFileSync('scripts/_faq-fab-scan.txt', out.join('\n'));
console.log('done');
