require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// HASH -> { table_name, row_id } (hardcoded from matching analysis)
const HASH_MAP = {
  '2a8a39cbdfab': { table: 'tours', id: '42a2941f-6b90-4f0a-9593-0ec1ec980a13' },
  '28f07b1a11a2': { table: 'tours', id: '77f34e21-9d9d-4be6-90b3-8148b2d82214' },
  'dee9e8483df5': { table: 'tours', id: 'c2db0455-a5c7-47f9-8925-2ce6dcc3434a' },
  '008ec5eaaa09': { table: 'tours', id: '7cb0c635-f7a7-4d98-a9b0-cde4997ca8ae' },
  '25db291faa87': { table: 'tours', id: '2dc6864a-30cb-4a8e-8277-a54c2ed8ca7d' },
  '4c12867ac2bc': { table: 'tours', id: '1c5a3c79-ab29-46c7-b480-36954adcc661', note: 'Luxor balloon' },
  '7b20cf5d22cc': { table: 'tours', id: '4f91f20d-ead4-4473-8700-371d4cb5fc4e' },
  '32c66735a1f5': { table: 'tours', id: '69aa0c36-125f-4f41-8502-55a8f4fd6d98' },
  '9952b38d84f4': { table: 'tours', id: '17a82d9b-2d00-4a29-8528-3c2e97a6bf26' },
  '40c11487086a': { table: 'tours', id: 'a8ddb433-a4fb-41ca-b90d-b399b4a57923' },
  '5a7382747d4a': { table: 'tours', id: '0009b90b-71a9-4e78-8459-e56bacce7cbf' },
  'ef3d6064fa0f': { table: 'tours', id: 'b604535f-6c99-4766-9150-c29fbbf5678c' },
  '561566897f35': { table: 'tours', id: 'f265b20c-db45-4173-a352-b1921fd7f744' },
  '8a02454b751a': { table: 'tours', id: 'c7b7cfad-0101-4997-ac52-e4456a21c252' },
  'fb3c8bec58f5': { table: 'tours', id: 'b604535f-6c99-4766-9150-c29fbbf5678c', note: 'Eden dup' },
  'ee026c48dda8': { table: 'tours', id: '69aa0c36-125f-4f41-8502-55a8f4fd6d98', note: 'OB dup' },
  '5187d3ddebfd': { table: 'tours', id: '27ae0b35-e0ef-4b01-9aa7-23d3210d74ff', note: 'Dolphin' },
  'a636556fb1c5': { table: 'tours', id: 'b2dc19de-fc9f-4a96-a742-7646e16a8486' },
  '338b867ec209': { table: 'tours', id: '6b629662-908c-40e3-b396-565393a6be18' },
  '8f41ef0dabe9': { table: 'tours', id: '94351900-ac6d-4c76-92e1-f9e1b1744f2f' },
  'c38cd8de54da': { table: 'tours', id: '80dc4e17-ea30-4511-92be-5e8add77f139' },
  'c77ed0011fad': { table: 'tours', id: '65f786e7-75c3-457b-a66a-e9f91f2c950e' },
  '83e56dd4617c': { table: 'tours', id: '380712ad-0b71-4e9a-8bfd-4e34c6906afc' },
  'a3c533cbd796': { table: 'tours', id: '872d19ae-dd4c-4c01-9f1b-217e481b3732' },
  'f8ddab7438e2': { table: 'tours', id: 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0' },
  '756cac8d6261': { table: 'tours', id: '693d8094-990e-44b2-acfe-571c66ffbb44' },
  '7d33c7e346e1': { table: 'tours', id: '8c5d9ce5-9931-42a6-8f09-44adf155d616' },
  '6cb9cd40d9cb': { table: 'tours', id: 'a9e92b99-283c-4b1e-ac9a-12bfe9c7fef0', note: '2-day Cairo dup' },
  // Destinations
  '0fc40fd2d554': { table: 'destinations', id: '5233806c-dc22-4dc1-8aa8-5d90e819ef2c' },
  '6dbefb072765': { table: 'destinations', id: '5233806c-dc22-4dc1-8aa8-5d90e819ef2c', note: 'Cairo dup' },
  '188dd139781b': { table: 'destinations', id: '0cb58b8e-0abe-44b9-9469-3233654967b2' },
  'c8ec459c04bb': { table: 'destinations', id: '0cb58b8e-0abe-44b9-9469-3233654967b2', note: 'Luxor dup' },
  'edc77b3e4a19': { table: 'destinations', id: 'a74479e6-f15f-4053-85f5-d910217cd4e5' },
  '6efbd5cb9599': { table: 'destinations', id: 'a2b18fe9-0bd0-42a1-90d2-32151f220c3c' },
  '663adb3d4f84': { table: 'destinations', id: 'e8f6cfb1-c9ce-4adb-b3c2-4c381cd808a8' },
  '1847bc6df0ba': { table: 'destinations', id: 'c39caf1a-a278-4aaa-9735-a255c7a77a6d' },
  '27ce738b43c3': { table: 'destinations', id: 'fa58e909-0571-455a-99fb-abb4033443fd' },
  '5df87b5a2d72': { table: 'destinations', id: '08309a02-95d1-46e7-86c4-e385b7ebebce' },
  'bc65bf11de9b': { table: 'destinations', id: 'b8125c80-2ed7-4749-ab30-b77a6b186a2b' },
  '192b0c015603': { table: 'destinations', id: '97593e2f-2e87-4f78-855a-c1f8f52cd83c' },
  '20e0798cdba9': { table: 'destinations', id: '08309a02-95d1-46e7-86c4-e385b7ebebce', note: 'El Gouna dup' },
  '7b9996be59c0': { table: 'destinations', id: 'a2b18fe9-0bd0-42a1-90d2-32151f220c3c', note: 'Hurghada dup' },
  '3eb7d9019cd9': { table: 'destinations', id: 'b8125c80-2ed7-4749-ab30-b77a6b186a2b', note: 'Sahl dup' },
  '29c2cb9df5fd': { table: 'destinations', id: '97593e2f-2e87-4f78-855a-c1f8f52cd83c', note: 'Soma dup' },
  'eb3489e52133': { table: 'destinations', id: 'e8f6cfb1-c9ce-4adb-b3c2-4c381cd808a8', note: 'Quseir dup' },
  '65ac89a43560': { table: 'destinations', id: 'a74479e6-f15f-4053-85f5-d910217cd4e5', note: 'Makadi dup' },
  '7ac0bb0d8435': { table: 'destinations', id: 'fa58e909-0571-455a-99fb-abb4033443fd', note: 'Marsa dup' },
  '25e6822645f2': { table: 'destinations', id: 'c39caf1a-a278-4aaa-9735-a255c7a77a6d', note: 'Safaga dup' },
  // Blog posts
  'bb5cb2792fee': { table: 'blog_posts', id: 'bc3112c6-a2e1-4475-997b-39e2a77e228e' },
  'd54b74b0f1f4': { table: 'blog_posts', id: '47f7dda0-2b6f-475c-be26-a01bd5debd08' },
  '298f1c88cad3': { table: 'blog_posts', id: '8967bf58-d218-4388-a386-2c56fc36f861' },
  'e88d44b1765f': { table: 'blog_posts', id: 'a06032c3-164a-4be2-a2d7-625cc2e7baa5' },
  '4f02511fdcc4': { table: 'blog_posts', id: '9e076f56-ac05-46a5-8355-2b1aafc9c8a1' },
  '057ff7aab004': { table: 'blog_posts', id: 'bc3112c6-a2e1-4475-997b-39e2a77e228e', note: 'arabic best tours' },
  // Aggregate FAQ hash - will be handled with per-faq parsing
  '0d434f7e75cc': { table: 'SKIP', id: null },
};

function splitToArray(val) {
  if (!val) return [];
  return val.split(/---SPLIT---|---تسيب---|---ЦЭП---/).map(s => s.trim()).filter(Boolean);
}

function sqlEscape(val) {
  if (val == null) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function jsonEscape(val) {
  if (val == null) return 'NULL';
  return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
}

(async () => {
  console.error('Fetching EAV data...');
  let allRows = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const { data: page } = await supabase.from('content_translations')
      .select('content_hash, locale, field, value')
      .range(offset, offset + pageSize - 1);
    if (!page || page.length === 0) break;
    allRows = allRows.concat(page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }
  console.error(`Got ${allRows.length} EAV rows`);

  // Parse: group by hash + locale -> field -> value
  const parsed = {};
  for (const row of allRows) {
    const parts = row.content_hash.split(':');
    if (parts.length < 3) continue;
    const locale = parts[0];
    const hash = parts[1];
    const field = row.field;
    if (!parsed[hash]) parsed[hash] = {};
    if (!parsed[hash][locale]) parsed[hash][locale] = {};
    parsed[hash][locale][field] = row.value;
  }

  // Handle aggregate FAQ hash separately
  // The FAQ hash (0d434f7e75cc) has faqQuestions and faqAnswers as concatenated strings
  // We'll parse them into per-faq translations
  const faqHash = '0d434f7e75cc';
  const faqParsed = parsed[faqHash];
  const faqMappings = {}; // locale -> [{question, answer}]

  if (faqParsed) {
    for (const [locale, fields] of Object.entries(faqParsed)) {
      const questions = splitToArray(fields.faqQuestions);
      const answers = splitToArray(fields.faqAnswers);
      const faqs = [];
      for (let i = 0; i < Math.max(questions.length, answers.length); i++) {
        faqs.push({ question: questions[i] || '', answer: answers[i] || '' });
      }
      faqMappings[locale] = faqs;
    }
  }

  // Build INSERT rows
  const insertRows = [];

  for (const [hash, localeData] of Object.entries(parsed)) {
    if (hash === faqHash) continue; // handled separately

    const mapping = HASH_MAP[hash];
    if (!mapping || mapping.table === 'SKIP') continue;

    for (const [locale, fields] of Object.entries(localeData)) {
      if (locale === 'de') continue;

      const tableName = mapping.table;
      const rowId = mapping.id;

      if (tableName === 'tours') {
        insertRows.push({
          table_name: tableName,
          row_id: rowId,
          locale,
          hash,
          cols: {
            name: fields.name || null,
            description: fields.description || null,
            short_description: fields.shortDescription || null,
            category_label: fields.categoryLabel || null,
            highlights: splitToArray(fields.highlights),
            included: splitToArray(fields.included),
            not_included: splitToArray(fields.notIncluded),
            meeting_point: fields.meetingPoint || null,
            duration: fields.duration || null,
            title: null,
            excerpt: null,
            content: null,
            read_time: null,
            faqs: (() => {
              const qs = splitToArray(fields.faqQ);
              const as = splitToArray(fields.faqA);
              const result = [];
              for (let i = 0; i < Math.max(qs.length, as.length); i++) {
                result.push({ question: qs[i] || '', answer: as[i] || '' });
              }
              return result.length > 0 ? result : [];
            })(),
          },
        });
      } else if (tableName === 'destinations') {
        insertRows.push({
          table_name: tableName,
          row_id: rowId,
          locale,
          hash,
          cols: {
            name: fields.name || null,
            description: fields.description || null,
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
          },
        });
      } else if (tableName === 'blog_posts') {
        insertRows.push({
          table_name: tableName,
          row_id: rowId,
          locale,
          hash,
          cols: {
            name: null,
            description: null,
            short_description: null,
            category_label: null,
            highlights: [],
            included: [],
            not_included: [],
            meeting_point: null,
            duration: null,
            title: fields.title || null,
            excerpt: fields.excerpt || null,
            content: fields.content || null,
            read_time: fields.readTime || null,
            faqs: [],
          },
        });
      }
    }
  }

  // Deduplicate: for same (table_name, row_id, locale), keep the row with most non-null fields
  const deduped = {};
  for (const row of insertRows) {
    const key = `${row.table_name}:${row.row_id}:${row.locale}`;
    const count = Object.values(row.cols).filter(v => v != null && (!Array.isArray(v) || v.length > 0)).length;
    if (!deduped[key] || count > deduped[key]._count) {
      row._count = count;
      deduped[key] = row;
    }
  }

  // Add FAQ translations as separate rows (using first tour as placeholder — skip for now, FAQs are in the base table)
  const finalRows = Object.values(deduped).map(r => { delete r._count; return r; });
  console.error(`Deduplicated to ${finalRows.length} rows (from ${insertRows.length})`);

  // Generate SQL
  const lines = [];
  lines.push('-- Migration 003: Transform content_translations from EAV to row-per-locale schema');
  lines.push('-- Generated: ' + new Date().toISOString());
  lines.push('');
  lines.push('-- =====================================================');
  lines.push('-- STEP 1: Rename old EAV table');
  lines.push('-- =====================================================');
  lines.push('ALTER TABLE IF EXISTS content_translations RENAME TO content_translations_eav;');
  lines.push('');
  lines.push('-- =====================================================');
  lines.push('-- STEP 2: Create new row-per-locale table');
  lines.push('-- =====================================================');
  lines.push(`CREATE TABLE content_translations (
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

CREATE INDEX idx_ct_table_row ON content_translations(table_name, row_id);
CREATE INDEX idx_ct_locale ON content_translations(locale);
CREATE UNIQUE INDEX idx_ct_table_row_locale ON content_translations(table_name, row_id, locale);`);
  lines.push('');
  lines.push('-- =====================================================');
  lines.push('-- STEP 3: Insert translated data');
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
  lines.push('-- STEP 4: Verify');
  lines.push('-- =====================================================');
  lines.push("SELECT table_name, locale, COUNT(*) as cnt FROM content_translations GROUP BY table_name, locale ORDER BY table_name, locale;");

  const sqlContent = lines.join('\n');
  const outPath = path.join(__dirname, 'migrations', '003_migrate_content_translations.sql');
  fs.writeFileSync(outPath, sqlContent, 'utf8');
  console.error(`\nSQL written to: ${outPath}`);
  console.error(`Total INSERT rows: ${finalRows.length}`);
  console.error(`File size: ${(sqlContent.length / 1024).toFixed(1)} KB`);
})();
