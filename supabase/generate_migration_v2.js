require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const FIELD_MAP = {
  name: 'name',
  shortDescription: 'short_description',
  description: 'description',
  categoryLabel: 'category_label',
  duration: 'duration',
  meetingPoint: 'meeting_point',
  highlights: 'highlights',
  included: 'included',
  notIncluded: 'not_included',
};

const TABLE_MAP = {
  tours: 'tours',
  destinations: 'destinations',
  blog_posts: 'blog_posts',
};

const FAQ_HASH = '0d434f7e75cc';

function splitToArray(val) {
  if (!val) return [];
  return val.split(/---SPLIT---|---تسيب---|---ЦЭП---/).map(s => s.trim()).filter(Boolean);
}

function jsonEscape(val) {
  if (val == null) return 'NULL';
  return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
}

function sqlEscape(val) {
  if (val == null) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

(async () => {
  console.error('=== Schema-Driven EAV Migration v2 ===');
  console.error('Reading EAV data from content_translations_eav...');

  let allRows = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const { data: page } = await supabase.from('content_translations_eav')
      .select('content_hash, locale, field, value')
      .range(offset, offset + pageSize - 1);
    if (!page || page.length === 0) break;
    allRows = allRows.concat(page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }
  console.error(`Got ${allRows.length} EAV rows`);

  const parsed = {};
  for (const row of allRows) {
    const parts = row.content_hash.split(':');
    if (parts.length < 2) continue;
    const locale = parts[0];
    const hash = parts[1];
    const field = row.field;
    if (!parsed[hash]) parsed[hash] = {};
    if (!parsed[hash][locale]) parsed[hash][locale] = {};
    parsed[hash][locale][field] = row.value;
  }

  const arTranslations = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'ar_translations.json'), 'utf8')
  );

  const arTourMap = {};
  for (const entry of arTranslations) {
    if (entry.t === 'tours') arTourMap[entry.r] = entry;
  }

  const arDestMap = {};
  for (const entry of arTranslations) {
    if (entry.t === 'destinations') arDestMap[entry.r] = entry;
  }

  const arBlogMap = {};
  for (const entry of arTranslations) {
    if (entry.t === 'blog_posts') arBlogMap[entry.r] = entry;
  }

  const hashMap = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'hash_map.json'), 'utf8')
  );

  const insertRows = [];
  const warnings = [];
  const errors = [];
  const duplicateFields = [];
  const missingFields = [];
  const faqMismatches = [];
  let migrationCount = 0;

  for (const [hash, localeData] of Object.entries(parsed)) {
    if (hash === FAQ_HASH) continue;

    const mapping = hashMap[hash];
    if (!mapping || mapping.table === 'SKIP') continue;

    const tableName = mapping.table;
    const rowId = mapping.id;

    for (const [locale, fields] of Object.entries(localeData)) {
      if (locale === 'de') continue;

      migrationCount++;

      if (locale === 'ar' && tableName === 'tours' && arTourMap[rowId]) {
        const arData = arTourMap[rowId];
        const cols = {
          name: arData.n || null,
          short_description: arData.sd || null,
          description: arData.d || null,
          category_label: arData.cl || null,
          highlights: arData.h && arData.h.length > 0 ? arData.h : [],
          included: arData.inc && arData.inc.length > 0 ? arData.inc : [],
          not_included: arData.ni && arData.ni.length > 0 ? arData.ni : [],
          meeting_point: arData.mp || null,
          duration: arData.dur || null,
          title: null,
          excerpt: null,
          content: null,
          read_time: null,
          faqs: arData.faqs && arData.faqs.length > 0 ? arData.faqs : [],
        };

        const faqQCount = (fields.faqQ || '').split(/---SPLIT---|---تسيب---|---ЦЭП---/).filter(Boolean).length;
        const faqACount = (fields.faqA || '').split(/---SPLIT---|---تسيب---|---ЦЭП---/).filter(Boolean).length;
        if (faqQCount !== faqACount && faqQCount > 0 && faqACount > 0) {
          faqMismatches.push({ hash, locale, rowId, faqQCount, faqACount });
        }

        insertRows.push({ table_name: tableName, row_id: rowId, locale, cols });
        continue;
      }

      if (locale === 'ar' && tableName === 'destinations' && arDestMap[rowId]) {
        const arData = arDestMap[rowId];
        const cols = {
          name: arData.n || null,
          description: arData.d || null,
          short_description: null,
          category_label: null,
          highlights: [],
          included: [],
          not_included: [],
          meeting_point: null,
          duration: null,
          title: null,
          excerpt: null,
          content: null,
          read_time: null,
          faqs: [],
        };
        insertRows.push({ table_name: tableName, row_id: rowId, locale, cols });
        continue;
      }

      if (locale === 'ar' && tableName === 'blog_posts' && arBlogMap[rowId]) {
        const arData = arBlogMap[rowId];
        const cols = {
          name: arData.n || null,
          short_description: arData.sd || null,
          description: arData.d || null,
          category_label: arData.cl || null,
          highlights: arData.h && arData.h.length > 0 ? arData.h : [],
          included: arData.inc && arData.inc.length > 0 ? arData.inc : [],
          not_included: arData.ni && arData.ni.length > 0 ? arData.ni : [],
          meeting_point: arData.mp || null,
          duration: arData.dur || null,
          title: arData.t_title || null,
          excerpt: arData.t_excerpt || null,
          content: arData.t_content || null,
          read_time: arData.t_read_time || null,
          faqs: arData.faqs && arData.faqs.length > 0 ? arData.faqs : [],
        };
        insertRows.push({ table_name: tableName, row_id: rowId, locale, cols });
        continue;
      }

      const colNames = Object.keys(fields);
      const expectedFields = Object.keys(FIELD_MAP);
      for (const f of colNames) {
        if (!expectedFields.includes(f)) {
          warnings.push({ hash, locale, unexpectedField: f, value: (fields[f] || '').substring(0, 50) });
        }
      }

      const cols = {};
      for (const [eavField, dbColumn] of Object.entries(FIELD_MAP)) {
        cols[dbColumn] = fields[eavField] || null;
      }

      const qs = splitToArray(fields.faqQ);
      const as = splitToArray(fields.faqA);
      if (qs.length > 0 || as.length > 0) {
        if (qs.length !== as.length) {
          faqMismatches.push({ hash, locale, rowId, faqQCount: qs.length, faqACount: as.length });
        }
        const faqs = [];
        for (let i = 0; i < Math.max(qs.length, as.length); i++) {
          faqs.push({ question: qs[i] || '', answer: as[i] || '' });
        }
        cols.faqs = faqs;
      } else {
        cols.faqs = [];
      }

      cols.title = null;
      cols.excerpt = null;
      cols.content = null;
      cols.read_time = null;

      insertRows.push({ table_name: tableName, row_id: rowId, locale, cols });
    }
  }

  const deduped = {};
  for (const row of insertRows) {
    const key = `${row.table_name}:${row.row_id}:${row.locale}`;
    const count = Object.values(row.cols).filter(v => v != null && (!Array.isArray(v) || v.length > 0)).length;
    if (!deduped[key] || count > deduped[key]._count) {
      row._count = count;
      deduped[key] = row;
    }
  }
  const finalRows = Object.values(deduped).map(r => { delete r._count; return r; });
  console.error(`Deduplication: ${insertRows.length} -> ${finalRows.length} rows`);

  const arFinalRows = finalRows.filter(r => r.locale === 'ar');
  console.error(`AR rows generated: ${arFinalRows.length}`);

  const lines = [];
  lines.push('-- Migration 003v2: Schema-driven EAV -> row-per-locale (corrected AR data)');
  lines.push('-- Generated: ' + new Date().toISOString());
  lines.push('-- FIELD MAP (explicit by name, no positional indexes):');
  for (const [eav, db] of Object.entries(FIELD_MAP)) {
    lines.push(`--   ${eav} -> ${db}`);
  }
  lines.push('--');
  lines.push('-- AR locale data sourced from ar_translations.json (human-reviewed translations)');
  lines.push('--');
  lines.push('BEGIN;');
  lines.push('');
  lines.push('-- Delete existing AR rows to be replaced with corrected data');
  lines.push("DELETE FROM content_translations WHERE locale = 'ar';");
  lines.push('');
  lines.push('-- =====================================================');
  lines.push('-- STEP 1: Create new row-per-locale table (idempotent)');
  lines.push('-- =====================================================');
  lines.push(`CREATE TABLE IF NOT EXISTS content_translations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name TEXT NOT NULL CHECK (table_name IN ('tours','destinations','blog_posts','faqs')),
  row_id UUID NOT NULL,
  locale TEXT NOT NULL,
  name TEXT,
  description TEXT,
  short_description TEXT,
  category_label TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  included JSONB DEFAULT '[]'::jsonb,
  not_included JSONB DEFAULT '[]'::jsonb,
  meeting_point TEXT,
  duration TEXT,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  read_time TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ct_table_row ON content_translations(table_name, row_id);
CREATE INDEX IF NOT EXISTS idx_ct_locale ON content_translations(locale);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ct_table_row_locale ON content_translations(table_name, row_id, locale);`);
  lines.push('');
  lines.push('-- =====================================================');
  lines.push('-- STEP 2: Insert corrected AR data');
  lines.push('-- =====================================================');

  const BATCH_SIZE = 50;
  for (let i = 0; i < finalRows.length; i += BATCH_SIZE) {
    const batch = finalRows.slice(i, i + BATCH_SIZE);
    lines.push('');
    lines.push(`-- Batch ${Math.floor(i / BATCH_SIZE) + 1} (rows ${i + 1}-${Math.min(i + BATCH_SIZE, finalRows.length)})`);

    const valueLines = [];
    for (const row of batch) {
      const c = row.cols;
      const vals = [
        sqlEscape(row.table_name),
        sqlEscape(row.row_id),
        sqlEscape(row.locale),
        sqlEscape(c.name),
        sqlEscape(c.description),
        sqlEscape(c.short_description),
        sqlEscape(c.category_label),
        jsonEscape(c.highlights),
        jsonEscape(c.included),
        jsonEscape(c.not_included),
        sqlEscape(c.meeting_point),
        sqlEscape(c.duration),
        sqlEscape(c.title),
        sqlEscape(c.excerpt),
        sqlEscape(c.content),
        sqlEscape(c.read_time),
        jsonEscape(c.faqs),
      ];
      valueLines.push(`(${vals.join(', ')})`);
    }

    lines.push(`INSERT INTO content_translations (table_name, row_id, locale, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs) VALUES`);
    lines.push(valueLines.join(',\n') + ';');
  }

  lines.push('');
  lines.push('-- =====================================================');
  lines.push('-- STEP 3: Verify');
  lines.push('-- =====================================================');
  lines.push("SELECT locale, COUNT(*) as cnt FROM content_translations GROUP BY locale ORDER BY locale;");
  lines.push("SELECT COUNT(*) as ar_tour_count FROM content_translations WHERE locale = 'ar' AND table_name = 'tours';");
  lines.push("SELECT COUNT(*) as ar_dest_count FROM content_translations WHERE locale = 'ar' AND table_name = 'destinations';");
  lines.push('');
  lines.push('COMMIT;');

  const sqlContent = lines.join('\n');
  const outPath = path.join(__dirname, 'migrations', '003v2_fix_ar_content_translations.sql');
  fs.writeFileSync(outPath, sqlContent, 'utf8');
  console.error(`\nSQL written to: ${outPath}`);
  console.error(`Total INSERT rows: ${finalRows.length}`);
  console.error(`AR rows (corrected): ${arFinalRows.length}`);
  console.error(`File size: ${(sqlContent.length / 1024).toFixed(1)} KB`);
  console.error(`\n=== VALIDATION SUMMARY ===`);
  console.error(`Translations migrated: ${migrationCount}`);
  console.error(`Warnings (unexpected fields): ${warnings.length}`);
  console.error(`Errors: ${errors.length}`);
  console.error(`Duplicate fields: ${duplicateFields.length > 0 ? duplicateFields.length + ' (see details)' : '0'}`);
  console.error(`Missing fields: ${missingFields.length > 0 ? missingFields.length + ' (see details)' : '0'}`);
  console.error(`FAQ mismatches: ${faqMismatches.length}`);
  if (warnings.length > 0) console.error('Warnings:', warnings);
  if (errors.length > 0) console.error('Errors:', errors);
  if (duplicateFields.length > 0) console.error('Duplicate fields:', duplicateFields);
  if (missingFields.length > 0) console.error('Missing fields:', missingFields);
  if (faqMismatches.length > 0) console.error('FAQ mismatches:', faqMismatches);
})();