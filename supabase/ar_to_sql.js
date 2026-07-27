const fs = require('fs');
const path = require('path');
const ar = JSON.parse(fs.readFileSync('ar_translations.json', 'utf8'));

function sqlEsc(val) {
  if (val == null) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}
function jsonEsc(val) {
  if (val == null) return 'NULL';
  return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
}

const lines = [];
lines.push('-- Migration 003v2: Schema-driven correction for AR locale content_translations');
lines.push('-- Generated: ' + new Date().toISOString());
lines.push('--');
lines.push('-- FIX DESCRIPTION:');
lines.push('-- The original EAV -> content_translations migration used POSITIONAL INDEX mapping,');
lines.push('-- which breaks whenever optional fields (categoryLabel, meetingPoint, duration, etc.)');
lines.push('-- are absent from the EAV layout, causing cascading column shifts.');
lines.push('--');
lines.push('-- This migration uses EXPLICIT FIELD-NAME mapping (schema-driven):');
lines.push('--   EAV field name -> content_translations column (direct 1:1 mapping)');
lines.push('--   name -> name');
lines.push('--   shortDescription -> short_description');
lines.push('--   description -> description');
lines.push('--   categoryLabel -> category_label');
lines.push('--   duration -> duration');
lines.push('--   meetingPoint -> meeting_point');
lines.push('--   highlights -> highlights (JSONB)');
lines.push('--   included -> included (JSONB)');
lines.push('--   notIncluded -> not_included (JSONB)');
lines.push('--   faqQ + faqA -> faqs (JSONB array of {question, answer})');
lines.push('--');
lines.push('-- No positional indexes. No alphabetical sorting. No heuristics.');
lines.push('--');
lines.push('-- SOURCE: ar_translations.json (27 entities, reviewed and corrected)');
lines.push('--');
lines.push('BEGIN;');
lines.push('');
lines.push("-- Delete existing AR rows from content_translations");
lines.push("DELETE FROM content_translations WHERE locale = 'ar';");
lines.push('');
lines.push('-- Insert corrected AR data');

let count = 0;
for (const entry of ar) {
  count++;
  const { t: table, r: rowId, n: name, d: description, sd: shortDesc, cl: catLabel, mp: meetingPoint, dur: duration } = entry;
  const highlights = entry.h ? jsonEsc(entry.h) : jsonEsc([]);
  const included = entry.inc ? jsonEsc(entry.inc) : jsonEsc([]);
  const notIncluded = entry.ni ? jsonEsc(entry.ni) : jsonEsc([]);
  const faqs = entry.faqs && entry.faqs.length > 0 ? jsonEsc(entry.faqs) : jsonEsc([]);

  // Blog-post-specific columns (t_title, t_excerpt, t_content, t_read_time)
  const blogTitle    = entry.t_title    != null ? sqlEsc(entry.t_title)    : 'NULL';
  const blogExcerpt  = entry.t_excerpt  != null ? sqlEsc(entry.t_excerpt)  : 'NULL';
  const blogContent  = entry.t_content  != null ? sqlEsc(entry.t_content)  : 'NULL';
  const blogReadTime = entry.t_read_time != null ? sqlEsc(entry.t_read_time) : 'NULL';

  const vals = [
    sqlEsc(table),
    sqlEsc(rowId),
    "'ar'",
    sqlEsc(name),
    sqlEsc(description),
    sqlEsc(shortDesc),
    sqlEsc(catLabel),
    highlights,
    included,
    notIncluded,
    sqlEsc(meetingPoint),
    sqlEsc(duration),
    blogTitle,
    blogExcerpt,
    blogContent,
    blogReadTime,
    faqs,
  ];

  lines.push(`-- Row ${count}: ${table} ${rowId.substring(0,8)} | ${(name||'').substring(0,50)}`);
  lines.push(`INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs)`);
  lines.push(`VALUES (${vals.join(', ')});`);
  lines.push('');
}

lines.push('-- Verification queries');
lines.push("SELECT locale, table_name, COUNT(*) as cnt FROM content_translations WHERE locale = 'ar' GROUP BY locale, table_name ORDER BY table_name;");
lines.push("SELECT COUNT(*) as total_ar_rows FROM content_translations WHERE locale = 'ar';");
lines.push("SELECT table_name, COUNT(*) as tour_count FROM content_translations WHERE locale = 'ar' AND table_name = 'tours' GROUP BY table_name;");
lines.push("SELECT table_name, COUNT(*) as dest_count FROM content_translations WHERE locale = 'ar' AND table_name = 'destinations' GROUP BY table_name;");
lines.push('');
lines.push('COMMIT;');

const outDir = path.join(__dirname, 'migrations');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, '003v2_fix_ar_content_translations.sql');
fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
console.log(`Generated ${outFile}`);
console.log(`Rows: ${count}`);
console.log(`Tours: ${ar.filter(e => e.t === 'tours').length}`);
console.log(`Destinations: ${ar.filter(e => e.t === 'destinations').length}`);
console.log(`File size: ${(fs.statSync(outFile).size / 1024).toFixed(1)} KB`);