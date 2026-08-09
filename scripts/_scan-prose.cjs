const fs = require('fs');
const c = fs.readFileSync('DRYRUN_AR_FAQ_LISTS.md', 'utf8');
const lines = c.split('\n');
const out = [];
let cur = null, sec = null;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const m = l.match(/^## Tour: `([^`]+)`/);
  if (m) { cur = m[1]; sec = null; continue; }
  if (!cur) continue;
  const h = l.match(/^### (FAQs|Highlights|Included|Not included)\b/);
  if (h) { sec = h[1]; continue; }
  if (sec === null) continue;
  const t = l.trim();
  if (t === '') continue;
  const isRow = t.startsWith('|') && t.endsWith('|');
  if (!isRow) {
    out.push(cur + ' [' + sec + '] non-table line: ' + t.slice(0, 140));
  }
}
fs.writeFileSync('_prose_scan.txt', out.join('\n'));
console.log('PROSE_LINES=' + out.length);
