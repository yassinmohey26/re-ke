const fs = require('fs');
const t = JSON.parse(fs.readFileSync('ar_translations.json','utf8'));
const e = t[4]; // El Gouna (tour with all fields)

const mapping = {
  t: 'table_name', r: 'row_id', n: 'name', d: 'description',
  sd: 'short_description', cl: 'category_label', h: 'highlights',
  inc: 'included', ni: 'not_included', mp: 'meeting_point',
  dur: 'duration', faqs: 'faqs'
};

function sqlVal(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'string') {
    const escaped = v.replace(/'/g, "''");
    return "E'" + escaped + "'";
  }
  // JSONB: stringify
  return "'" + JSON.stringify(v) + "'::jsonb";
}

const cols = ['locale'];
const vals = ["'ar'"];
const updates = [];

for (const [shortKey, dbCol] of Object.entries(mapping)) {
  const val = e[shortKey];
  if (val === undefined) continue;
  cols.push(dbCol);
  vals.push(sqlVal(val));
  if (shortKey !== 't' && shortKey !== 'r') {
    updates.push(dbCol + ' = EXCLUDED.' + dbCol);
  }
}

console.log('=== FIRST UPSERT (El Gouna) --- REVIEW THIS ===');
console.log('');
console.log('INSERT INTO content_translations');
console.log('  (' + cols.join(', ') + ')');
console.log('VALUES');
console.log('  (' + vals.join(',\n    ') + ')');
console.log('ON CONFLICT (table_name, row_id, locale)');
console.log('DO UPDATE SET');
console.log('  ' + updates.join(',\n  ') + ';');
console.log('');
console.log('=== COLUMN MAPPING ===');
for (const [shortKey, dbCol] of Object.entries(mapping)) {
  const val = e[shortKey];
  let type;
  if (val === undefined) type = 'OMITTED';
  else if (Array.isArray(val)) type = 'jsonb[' + val.length + ' items]';
  else if (typeof val === 'string') type = 'text (' + val.length + ' chars)';
  else type = typeof val;
  console.log('  ' + shortKey + ' -> ' + dbCol + ' (' + type + ')');
}
