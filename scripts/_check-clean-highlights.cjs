const fs = require('fs');
const d = require('./ar_dump.json');
const out = [];
for (const slug of ['quad-tour-hurghada-kamelritt', 'orange-bay-insel-schnorchelausflug-hurghada', 'hula-hula-insel-schnorchelausflug-hurghada']) {
  const t = d.find(x => x.slug === slug);
  if (!t) { out.push('MISSING TOUR ' + slug); continue; }
  out.push('### ' + slug);
  out.push('DE highlights count=' + (t.de.highlights || []).length);
  (t.de.highlights || []).forEach((v, i) => out.push('  de[' + i + '] ' + JSON.stringify(v.slice(0, 70))));
  out.push('AR highlights count=' + (t.ar.highlights || []).length);
  (t.ar.highlights || []).forEach((v, i) => out.push('  ar[' + i + '] ' + JSON.stringify(v.slice(0, 70))));
  out.push('');
}
fs.writeFileSync('_clean_highlights.txt', out.join('\n'));
console.log('WROTE');
