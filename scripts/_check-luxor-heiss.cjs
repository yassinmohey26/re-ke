const fs = require('fs');
const p = JSON.parse(fs.readFileSync('_parsed_plan.json', 'utf8'));
const t = p.tours.find(x => x.slug === 'luxor-tagesausflug-heissluftballon-hoteluebernachtung');
const out = [];
t.faqs.forEach(o => {
  out.push(o.op + ' | deq=' + (o.deq || '').slice(0, 35) + ' | curQ=' + JSON.stringify(o.curQ) + ' | q=' + JSON.stringify(o.q) + ' | a=' + JSON.stringify((o.a || '').slice(0, 90)));
});
fs.writeFileSync('_luxor_heiss_faqs.txt', out.join('\n'));
console.log('OPS=' + t.faqs.length);
