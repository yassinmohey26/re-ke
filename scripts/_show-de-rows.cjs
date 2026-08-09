const fs = require('fs');
const d = require('./ar_dump.json');
const bySlug = Object.fromEntries(d.map(x => [x.slug, x]));
const out = [];

const t1 = bySlug['2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben'];
out.push('### 2-tages DE not_included (base row, verbatim)');
out.push('count=' + (t1.de.not_included || []).length);
(t1.de.not_included || []).forEach((v, i) => out.push('  de[' + i + '] ' + JSON.stringify(v)));

const t2 = bySlug['super-safari-hurghada'];
out.push('');
out.push('### super-safari DE included (base row, verbatim)');
out.push('count=' + (t2.de.included || []).length);
(t2.de.included || []).forEach((v, i) => out.push('  de[' + i + '] ' + JSON.stringify(v)));

const t3 = bySlug['naechtliche-stadtrundfahrt-durch-hurghada-private-tour'];
out.push('');
out.push('### naechtliche DE highlights (base row, verbatim)');
out.push('count=' + (t3.de.highlights || []).length);
(t3.de.highlights || []).forEach((v, i) => out.push('  de[' + i + '] ' + JSON.stringify(v)));

fs.writeFileSync('_de_rows.txt', out.join('\n'));
console.log('WROTE');
