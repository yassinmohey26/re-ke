const fs = require('fs');
const lines = fs.readFileSync('DRYRUN_AR_FAQ_LISTS.md', 'utf8').split('\n');
const d = require('./ar_dump.json');
const out = [];
const bySlug = Object.fromEntries(d.map(x => [x.slug, x]));

function extractSection(slug, header) {
  let inTour = false, inSec = false;
  const rows = [];
  for (const l of lines) {
    const tm = l.match(/^## Tour: `([^`]+)`/);
    if (tm) { inTour = (tm[1] === slug); inSec = false; continue; }
    if (!inTour) continue;
    const hm = l.match(/^### (FAQs|Highlights|Included|Not included)\b/);
    if (hm) { inSec = (hm[0] === header); continue; }
    if (inSec && l.trim() !== '' && !l.startsWith('---')) rows.push(l.trim());
  }
  return rows;
}

out.push('################ 1) 2-tages not_included — REPORT ROWS ################');
for (const r of extractSection('2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben', '### Not included')) out.push(r);
out.push('');
out.push('--- DUMP items (current AR, verbatim) ---');
const t1 = bySlug['2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben'];
(t1.ar.not_included || []).forEach((v, i) => out.push('  dump[' + i + '] ' + JSON.stringify(v)));
out.push('');

out.push('################ 2) super-safari included — REPORT ROWS ################');
for (const r of extractSection('super-safari-hurghada', '### Included')) out.push(r);
out.push('');
out.push('--- DUMP items (current AR, verbatim) ---');
const t2 = bySlug['super-safari-hurghada'];
(t2.ar.included || []).forEach((v, i) => out.push('  dump[' + i + '] ' + JSON.stringify(v)));
out.push('');

out.push('################ 3) naechtliche highlights — REPORT PROSE ################');
for (const r of extractSection('naechtliche-stadtrundfahrt-durch-hurghada-private-tour', '### Highlights')) out.push(r);
out.push('');
out.push('--- DUMP items (current AR, verbatim) ---');
const t3 = bySlug['naechtliche-stadtrundfahrt-durch-hurghada-private-tour'];
(t3.ar.highlights || []).forEach((v, i) => out.push('  dump[' + i + '] ' + JSON.stringify(v)));

fs.writeFileSync('_mismatch_details.txt', out.join('\n'));
console.log('WROTE ' + out.length + ' lines');
