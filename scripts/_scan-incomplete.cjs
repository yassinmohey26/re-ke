const fs = require('fs');
const p = JSON.parse(fs.readFileSync('_parsed_plan.json', 'utf8'));
const out = [];
for (const t of p.tours) {
  for (const o of t.faqs) {
    if (o.op === 'add' && (!o.a || !o.a.trim())) out.push('EMPTY-ANSWER add [' + t.slug + '] q=' + o.q);
    if (o.op === 'add' && (!o.q || !o.q.trim())) out.push('EMPTY-QUESTION add [' + t.slug + '] a=' + (o.a || '').slice(0, 40));
    if (o.op === 'replace' && (!o.q || !o.q.trim())) out.push('EMPTY-Q replace [' + t.slug + '] deq=' + (o.deq || '').slice(0, 40));
  }
  for (const f of ['highlights', 'included', 'not_included']) {
    for (const o of t.list[f]) {
      if ((o.op === 'add' || o.op === 'replace') && (!o.value || !o.value.trim())) out.push('EMPTY-VALUE ' + o.op + ' [' + t.slug + '].' + f);
    }
  }
}
fs.writeFileSync('_incomplete_scan.txt', out.join('\n'));
console.log('ISSUES=' + out.length);
