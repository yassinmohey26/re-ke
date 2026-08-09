/* READ-ONLY: print DE included/not_included/highlights for tours with candidate leftover FAQ answers,
   plus the report removal reason for specific items. */
const fs = require('fs');
const dump = JSON.parse(fs.readFileSync('scripts/ar_dump.json', 'utf8'));
const lines = fs.readFileSync('scripts/DRYRUN_AR_FAQ_LISTS.md', 'utf8').split('\n');
const out = [];

const slugs = [
  'luxor-tagesausflug-ab-hurghada',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
  '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'hurghada-shopping-tour-basar-transfer',
];
for (const slug of slugs) {
  const d = dump.find(x => x.slug === slug);
  if (!d) continue;
  out.push('########## ' + slug);
  for (const f of ['highlights', 'included', 'not_included']) {
    out.push('--- DE ' + f + ':');
    (d.de[f] || []).forEach((v, i) => out.push('  ' + i + ': ' + v));
  }
  out.push('');
}

out.push('########## REPORT removal reasons (search)');
for (const token of ['مرشد سياحي', 'رسوم الدخول الإضافية', 'وجبتا غداء', 'نقل خاص بسيارة مكيفة', 'نقل من الفندق', 'متحدث', 'بالألمانية']) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(token)) out.push((i + 1) + ': ' + lines[i]);
  }
  out.push('');
}

fs.writeFileSync('scripts/_verify-leftovers.txt', out.join('\n'));
console.log('done');
