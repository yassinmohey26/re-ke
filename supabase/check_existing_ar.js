require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // 1. Current AR rows - check description and faqs columns
  const { data: arRows, error } = await supabase.from('content_translations')
    .select('row_id, table_name, name, description, faqs, highlights, included, not_included, meeting_point, duration, short_description, category_label')
    .eq('locale', 'ar');

  if (error) { console.log('ERROR:', error.message); return; }

  console.log('=== CURRENT AR ROWS: ALL NON-NULL FIELDS ===');
  for (const row of arRows) {
    const fields = ['description','faqs','highlights','included','not_included','meeting_point','duration','short_description','category_label'];
    const present = fields.filter(f => {
      const v = row[f];
      if (v === null || v === undefined) return false;
      if (typeof v === 'string' && v.length === 0) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    });
    if (present.length > 0) {
      console.log('[' + row.table_name + '] ' + row.row_id.substring(0,8) + ' ' + (row.name||'').substring(0,35));
      for (const f of present) {
        const v = row[f];
        const display = typeof v === 'string' ? v.substring(0,100) : JSON.stringify(v).substring(0,150);
        console.log('  ' + f + ': ' + display);
      }
    }
  }

  // 2. Counts
  const withDesc = arRows.filter(r => r.description && r.description.length > 0).length;
  const withFaqs = arRows.filter(r => r.faqs && Array.isArray(r.faqs) && r.faqs.length > 0).length;
  console.log('');
  console.log('AR rows with non-empty description: ' + withDesc + '/' + arRows.length);
  console.log('AR rows with non-empty faqs: ' + withFaqs + '/' + arRows.length);

  // 3. Which of our 27 entities already exist?
  const existingIds = new Set(arRows.map(r => r.row_id));
  const t = JSON.parse(fs.readFileSync('supabase/ar_translations.json', 'utf8'));
  const toUpdate = t.filter(x => existingIds.has(x.r));
  const toInsert = t.filter(x => !existingIds.has(x.r));
  console.log('');
  console.log('Our 27 entities: ' + toUpdate.length + ' UPDATE existing, ' + toInsert.length + ' INSERT new');

  // 4. For UPDATE targets: which have description/faqs in current DB that our JSON lacks?
  console.log('');
  console.log('=== FIELDS THAT WOULD BE LEFT UNCHANGED (omitted from DO UPDATE SET) ===');
  for (const entity of toUpdate) {
    const dbRow = arRows.find(r => r.row_id === entity.r);
    if (!dbRow) continue;
    const omitted = [];
    if (dbRow.description && dbRow.description.length > 0 && !entity.d) omitted.push('description=' + String(dbRow.description).substring(0,50));
    if (dbRow.faqs && Array.isArray(dbRow.faqs) && dbRow.faqs.length > 0 && !entity.faqs) omitted.push('faqs=' + JSON.stringify(dbRow.faqs).substring(0,60));
    if (omitted.length > 0) {
      console.log('[' + entity.r.substring(0,8) + '] ' + (entity.n||'').substring(0,30));
      for (const o of omitted) console.log('  KEPT: ' + o);
    }
  }

  // 5. For INSERT targets: what columns will be NULL?
  console.log('');
  console.log('=== NEW INSERTS: columns that will be NULL ===');
  for (const entity of toInsert) {
    const nulls = [];
    if (!entity.d) nulls.push('description');
    if (!entity.faqs) nulls.push('faqs');
    if (nulls.length > 0) {
      console.log('[' + entity.r.substring(0,8) + '] ' + (entity.n||'').substring(0,30) + ' -> NULL: ' + nulls.join(', '));
    }
  }
})();
