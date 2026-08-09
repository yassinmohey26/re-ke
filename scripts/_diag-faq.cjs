const fs = require('fs');
const c = fs.readFileSync('DRYRUN_AR_FAQ_LISTS.md', 'utf8');
const lines = c.split('\n');
const out = [];
let cur = null, sec = null, inFab = false, dbgTours = 0, dbgSections = 0, dbgRows = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const m = l.match(/^## Tour: `([^`]+)`/);
  if (m) { cur = m[1]; sec = null; inFab = false; dbgTours++; continue; }
  if (!cur) continue;
  const h = l.match(/^### (FAQs|Highlights|Included|Not included)\b/);
  if (h) { sec = h[1].toLowerCase(); inFab = false; dbgSections++; continue; }
  if (/^\*\*Fabricated/.test(l)) { inFab = true; continue; }
  const t = l.trim();
  if (!t.startsWith('|') || !t.endsWith('|')) continue;
  const r = t.slice(1, -1).split('|').map(s => s.trim());
  if (sec === 'faqs') {
    if (r[0] === '#' || r[1] === 'DE Q' || r[0] === 'AR Q' || /^[-]+$/.test(r[0])) continue;
    if (inFab) { out.push('REMOVE[' + cur + '] q=' + r[0]); continue; }
    if (/D\d+/.test(r[0])) {
      const num = r[0], deq = r[1], st = r[3] || '', prop = r[4] || '', ar = r[2] || '';
      if (/MISSING/.test(st)) out.push('ADD[' + cur + '] ' + num + ' deq=' + deq.slice(0, 40) + ' prop=' + prop.slice(0, 60));
      else if (/WRONG|SUBSTITUTED|CORRUPTED/.test(st)) out.push('REPLACE[' + cur + '] ' + num + ' deq=' + deq.slice(0, 40) + ' ar=' + ar.slice(0, 40));
      else out.push('OTHER[' + cur + '] ' + num + ' st=' + st + ' prop=' + prop.slice(0, 60));
    }
  }
}
fs.writeFileSync('_faq_diag.txt', out.join('\n'));
console.log('DIAG_LINES=' + out.length + ' tours=' + dbgTours + ' sections=' + dbgSections);
