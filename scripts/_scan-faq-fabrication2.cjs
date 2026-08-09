/* READ-ONLY: scan surviving FAQ answers against same-tour removed list content (highlights/included/not_included). */
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
function parseProposed(p) {
  const t = (p || '').trim();
  const mm = t.match(/^"([^"]+)"\s*→\s*"([^"]*)"$/);
  if (mm) return { q: mm[1], a: mm[2] };
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
      if (/MISSING/.test(s)) { const qa = parseProposed(p); cur.faqs.push({ op: 'add', deq, q: qa.q, a: qa.a }); }
      else if (/WRONG|SUBSTITUTED|CORRUPTED/.test(s)) { const qa = parseProposed(p); cur.faqs.push({ op: 'replace', deq, curQ: parseCurQ(arCell), q: qa.q, a: qa.a, note: s }); }
      else if (p.trim() && !/^keep/.test(p.trim())) { const qa = parseProposed(p); cur.faqs.push({ op: 'replace', deq, curQ: parseCurQ(arCell), q: qa.q, a: qa.a, note: s }); }
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

// long common substring
function lcs(a, b) {
  const m = a.length, n = b.length;
  let best = '';
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > best.length) best = a.slice(i - dp[i][j], i);
      }
    }
  }
  return best;
}

for (const t of tours) {
  const d = dump.find(x => x.slug === t.slug);
  if (!d) continue;
  const removed = [];
  for (const f of ['highlights', 'included', 'not_included']) {
    t.list[f].filter(o => o.op === 'remove').forEach(o => removed.push({ field: f, value: o.value }));
  }
  if (!removed.length) continue;
  // compute AFTER faqs
  const after = JSON.parse(JSON.stringify(d.ar.faqs || []));
  for (const o of t.faqs) {
    if (o.op === 'add') after.push({ question: o.q, answer: o.a || '' });
    else if (o.op === 'replace') {
      const idx = after.findIndex(f => f.question === o.curQ);
      if (idx >= 0) { after[idx].question = o.q || after[idx].question; after[idx].answer = o.a || ''; }
    } else if (o.op === 'remove') {
      const idx = after.findIndex(f => f.question === o.q);
      if (idx >= 0) after.splice(idx, 1);
    }
  }
  for (const f of after) {
    const text = (f.question || '') + ' | ' + (f.answer || '');
    for (const r of removed) {
      const l = lcs(text, r.value);
      if (l.length >= 8) {
        out.push(`[${t.slug}] Q: ${f.question}`);
        out.push(`  A: ${f.answer}`);
        out.push(`  -> shared fragment (${l.length}): "${l}" with removed [${r.field}]: "${r.value}"`);
      }
    }
  }
}

fs.writeFileSync('scripts/_faq-fab-scan2.txt', out.join('\n'));
console.log('done');
