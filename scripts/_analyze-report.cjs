/* READ-ONLY analysis: parse DRYRUN_AR_FAQ_LISTS.md into per-tour ops and count. No DB access. */
const fs = require('fs');
const c = fs.readFileSync('DRYRUN_AR_FAQ_LISTS.md', 'utf8');
const lines = c.split('\n');

function splitRow(l) {
  const t = l.trim();
  if (!t.startsWith('|') || !t.endsWith('|')) return null;
  const inner = t.slice(1, -1);
  return inner.split('|').map(s => s.trim());
}

const tours = [];
let cur = null;
let curSection = null;
let inFabricated = false;

function sectionType(header) {
  if (/^### FAQs/.test(header)) return 'faqs';
  if (/^### Highlights/.test(header)) return 'highlights';
  if (/^### Included/.test(header)) return 'included';
  if (/^### Not included/.test(header)) return 'not_included';
  return null;
}
function isClean(header) { return /- CLEAN/.test(header); }

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
  if (row.length === 1 && row[0].replace(/-+/g,'') === '') continue; // separator row
  // header rows
  if (curSection === 'faqs') {
    if (row[0] === '#' || row[1] === 'DE Q') continue;
    if (inFabricated) {
      if (row[0] === 'AR Q' || row[1] === 'AR A') continue; // table header
      if (/^[-]+$/.test(row[0]) && row[1] && /^[-]+$/.test(row[1])) continue; // separator
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
        // OK(partial) with a draft replacement
        const qa = parseProposed(p);
        cur.faqs.push({ op: 'replace', deq, curQ: parseCurQ(arCell), q: qa.q, a: qa.a, note: s });
      }
    }
  } else if (curSection) {
    if (row[1] === 'Current AR / status' || row[0] === 'DE item') continue;
    const [deItem, curCell, proposed] = row;
    const st = statusOf(curCell);
    if (st === 'ok' || st === 'covered') continue; // keep
    if (st === 'missing') { cur.list[curSection].push({ op: 'add', deItem, value: cleanProp(proposed) }); continue; }
    if (st === 'fabricated') { cur.list[curSection].push({ op: 'remove', deItem, value: stripNote(curCell) }); continue; }
    // partial / wrong / substituted / corrupted => replace
    cur.list[curSection].push({ op: 'replace', deItem, value: cleanProp(proposed), cur: stripNote(curCell) });
  }
}

function parseCurQ(arCell) {
  if (!arCell || arCell === '(none)') return '';
  if (arCell.startsWith('(covered')) return '';
  const arrow = arCell.indexOf('→');
  return arrow >= 0 ? arCell.slice(0, arrow).trim() : arCell.trim();
}
function parseProposed(p) {
  const t = (p || '').trim();
  // "Q" → "A"
  const m = t.match(/^"([^"]+)"\s*→\s*"([^"]*)"$/);
  if (m) return { q: m[1], a: m[2] };
  const m2 = t.match(/^([^→"]+)\s*→\s*"([^"]*)"$/);
  if (m2) return { q: m2[1].replace(/^"|"$/g, '').trim(), a: m2[2] };
  // "A" or A only (answer-only replacement: keep current Q)
  return { q: null, a: t.replace(/^"|"$/g, '') };
}
function statusOf(cell) {
  const t = (cell || '').trim();
  if (/^\*\*MISSING\*\*/.test(t)) return 'missing';
  if (/^\*\*FABRICATED\*\*/.test(t) || /\*\*FABRICATED\*\*/.test(t)) return 'fabricated';
  if (/^\(covered/.test(t)) return 'covered'; // covers "… previous AR row" forms incl. trailing notes
  if (/\*\*WRONG\*\*|\*\*SUBSTITUTED\*\*|\*\*CORRUPTED\*\*|partial/.test(t)) return 'replace';
  if (t === 'OK' || / - OK| - ok|OK \(/.test(t) || t.startsWith('OK')) return 'ok';
  return 'ok';
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

// ---------- counts ----------
let add=0, rem=0, rep=0;
for (const t of tours) {
  for (const o of t.faqs) { if (o.op==='add') add++; else if (o.op==='remove') rem++; else rep++; }
}
console.log('FAQ totals: adds=' + add + ' removes=' + rem + ' replaces=' + rep + ' (expect 78/41/52)');

for (const f of ['highlights','included','not_included']) {
  let a=0,r2=0,re2=0;
  for (const t of tours) for (const o of t.list[f]) { if(o.op==='add')a++; else if(o.op==='remove')r2++; else re2++; }
  console.log(f + ': adds=' + a + ' removes=' + r2 + ' replaces=' + re2 + ' total=' + (a+r2+re2));
}

// ---------- dump cross-check for replace/remove current text ----------
const dump = JSON.parse(fs.readFileSync('ar_dump.json','utf8'));
const bySlug = Object.fromEntries(dump.map(d => [d.slug, d]));
let mismatches = [];
for (const t of tours) {
  const d = bySlug[t.slug];
  if (!d) { mismatches.push('NO DUMP: ' + t.slug); continue; }
  for (const o of t.faqs) {
    if (o.op === 'remove') {
      const hit = (d.ar.faqs||[]).some(f => f.question === o.q);
      if (!hit) mismatches.push(`FAQ REMOVE no match [${t.slug}]: "${o.q}"`);
    } else if (o.op === 'replace') {
      const hit = (d.ar.faqs||[]).some(f => f.question === o.curQ);
      if (!hit) mismatches.push(`FAQ REPLACE no match [${t.slug}]: curQ="${o.curQ}"`);
    }
  }
  for (const f of ['highlights','included','not_included']) {
    for (const o of t.list[f]) {
      if (o.op === 'remove') {
        const hit = (d.ar[f]||[]).some(v => v === o.value);
        if (!hit) mismatches.push(`LIST REMOVE no match [${t.slug}].${f}: "${o.value}"`);
      } else if (o.op === 'replace') {
        const hit = (d.ar[f]||[]).some(v => v === o.cur);
        if (!hit) mismatches.push(`LIST REPLACE no match [${t.slug}].${f}: "${o.cur}"`);
      }
    }
  }
}
console.log('\nCross-check mismatches: ' + mismatches.length);
mismatches.slice(0, 60).forEach(m => console.log('  ' + m));
fs.writeFileSync('_parsed_plan.json', JSON.stringify({ tours }, null, 1));
