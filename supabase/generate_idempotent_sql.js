const fs = require('fs');
const path = require('path');
const ar = JSON.parse(fs.readFileSync('ar_translations.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('ru_translations.json', 'utf8'));

function sqlEsc(val) {
  if (val == null) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}
function jsonEsc(val) {
  if (val == null) return 'NULL';
  return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
}

const columns = [
  'table_name',
  'row_id', 
  'locale',
  'name',
  'description',
  'short_description',
  'category_label',
  'highlights',
  'included',
  'not_included',
  'meeting_point',
  'duration',
  'title',
  'excerpt',
  'content',
  'read_time',
  'faqs'
];

const updateCols = columns.filter(c => c !== 'table_name' && c !== 'row_id' && c !== 'locale');

const lines = [];
lines.push('-- Migration 003v3: Idempotent upsert for AR and RU locale content_translations');
lines.push('-- Generated: ' + new Date().toISOString());
lines.push('-- Uses INSERT ... ON CONFLICT DO UPDATE for safe re-runs');
lines.push('');
lines.push('BEGIN;');
lines.push('');
lines.push('-- Ensure unique index exists (idempotent)');
lines.push("CREATE UNIQUE INDEX IF NOT EXISTS idx_ct_table_row_locale ON content_translations(table_name, row_id, locale);");
lines.push('');

function getBlogField(entry, field, fallback) {
  return entry[field] || entry[fallback] || null;
}

function processLocale(entries, locale) {
  lines.push(`-- =====================================================`);
  lines.push(`-- ${locale.toUpperCase()} locale data`);
  lines.push(`-- =====================================================`);
  lines.push('');

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const { t: table, r: rowId, n: name, d: description, sd: shortDesc, cl: catLabel, mp: meetingPoint, dur: duration } = entry;
    const highlights = entry.h ? jsonEsc(entry.h) : jsonEsc([]);
    const included = entry.inc ? jsonEsc(entry.inc) : jsonEsc([]);
    const notIncluded = entry.ni ? jsonEsc(entry.ni) : jsonEsc([]);
    const faqs = entry.faqs && entry.faqs.length > 0 ? jsonEsc(entry.faqs) : jsonEsc([]);

    let titleVal, excerptVal, contentVal, readTimeVal;
    if (table === 'blog_posts') {
      titleVal = getBlogField(entry, 't_title', 'n');
      excerptVal = getBlogField(entry, 't_excerpt', 'sd');
      contentVal = getBlogField(entry, 't_content', 'd');
      readTimeVal = getBlogField(entry, 't_read_time', 'dur');
    } else {
      titleVal = null;
      excerptVal = null;
      contentVal = null;
      readTimeVal = null;
    }

    const vals = [
      sqlEsc(table),
      sqlEsc(rowId),
      "'" + locale + "'",
      sqlEsc(name),
      sqlEsc(description),
      sqlEsc(shortDesc),
      sqlEsc(catLabel),
      highlights,
      included,
      notIncluded,
      sqlEsc(meetingPoint),
      sqlEsc(duration),
      sqlEsc(titleVal),
      sqlEsc(excerptVal),
      sqlEsc(contentVal),
      sqlEsc(readTimeVal),
      faqs,
    ];

    const conflictCols = 'table_name, row_id, locale';
    const setClause = updateCols.map(c => `${c} = EXCLUDED.${c}`).join(',\n  ');

    lines.push(`-- Row ${i + 1}: ${table} ${rowId.substring(0,8)} | ${(name||'').substring(0,50)}`);
    lines.push(`INSERT INTO content_translations (${columns.join(', ')})`);
    lines.push(`VALUES (${vals.join(', ')})`);
    lines.push(`ON CONFLICT (${conflictCols}) DO UPDATE SET`);
    lines.push(`  ${setClause};`);
    lines.push('');
  }
}

// Process Arabic
processLocale(ar, 'ar');

// Process Russian
processLocale(ru, 'ru');

lines.push('-- Verification queries');
lines.push("SELECT locale, table_name, COUNT(*) as cnt FROM content_translations WHERE locale IN ('ar', 'ru') GROUP BY locale, table_name ORDER BY locale, table_name;");
lines.push("SELECT COUNT(*) as total_ar_rows FROM content_translations WHERE locale = 'ar';");
lines.push("SELECT COUNT(*) as total_ru_rows FROM content_translations WHERE locale = 'ru';");
lines.push('');
lines.push('COMMIT;');

const outDir = path.join(__dirname, 'migrations');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, '003v3_fix_ar_ru_content_translations_idempotent.sql');
fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
console.log(`Generated ${outFile}`);
console.log(`AR Rows: ${ar.length}`);
console.log(`RU Rows: ${ru.length}`);
console.log(`Total: ${ar.length + ru.length}`);
console.log(`AR Tours: ${ar.filter(e => e.t === 'tours').length}`);
console.log(`AR Destinations: ${ar.filter(e => e.t === 'destinations').length}`);
console.log(`AR Blog posts: ${ar.filter(e => e.t === 'blog_posts').length}`);
console.log(`RU Tours: ${ru.filter(e => e.t === 'tours').length}`);
console.log(`RU Destinations: ${ru.filter(e => e.t === 'destinations').length}`);
console.log(`RU Blog posts: ${ru.filter(e => e.t === 'blog_posts').length}`);
console.log(`File size: ${(fs.statSync(outFile).size / 1024).toFixed(1)} KB`);