require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // Fetch all AR rows from the new content_translations table
  const { data: arRows } = await supabase.from('content_translations')
    .select('table_name, row_id, name, description, short_description, category_label, highlights, included, not_included, meeting_point, duration, title, excerpt, content, read_time, faqs')
    .eq('locale', 'ar');

  console.log('Total AR rows:', arRows?.length || 0);

  // Also fetch base tables for entity names
  const { data: tours } = await supabase.from('tours').select('id, name');
  const { data: dests } = await supabase.from('destinations').select('id, name');
  const { data: posts } = await supabase.from('blog_posts').select('id, title');

  const tourMap = Object.fromEntries((tours || []).map(t => [t.id, t.name]));
  const destMap = Object.fromEntries((dests || []).map(d => [d.id, d.name]));
  const postMap = Object.fromEntries((posts || []).map(p => [p.id, p.title]));

  function getEntityName(row) {
    if (row.table_name === 'tours') return tourMap[row.row_id] || row.row_id;
    if (row.table_name === 'destinations') return destMap[row.row_id] || row.row_id;
    if (row.table_name === 'blog_posts') return postMap[row.row_id] || row.row_id;
    return row.row_id;
  }

  // Arabic detection
  function arabicRatio(text) {
    if (!text || text.length === 0) return 0;
    const chars = text.replace(/[\s\d\p{P}\p{S}]/gu, '');
    if (chars.length === 0) return 0;
    let count = 0;
    for (const ch of chars) {
      const code = ch.codePointAt(0);
      if (code >= 0x0600 && code <= 0x06FF) count++;
      if (code >= 0x0750 && code <= 0x077F) count++;
      if (code >= 0xFB50 && code <= 0xFDFF) count++;
      if (code >= 0xFE70 && code <= 0xFEFF) count++;
    }
    return count / chars.length;
  }

  function germanRatio(text) {
    if (!text || text.length === 0) return 0;
    const lower = text.toLowerCase();
    const words = lower.split(/\W+/).filter(Boolean);
    if (words.length === 0) return 0;
    const germanWords = new Set(['und','die','der','das','ein','eine','mit','von','für','ist','sind','nicht','auch','nach','auf','den','dem','des','wir','haben','werden','können','diese','dieser','dieses','bei','oder','aber','noch','wie','was','wenn','dann','so','um','aus','über','vor','zur','zum','im','am','vom','beim','einem','einer','eines','des','sie','er','es','ich','du','sich','ihr','uns','euch','ja','nein','bitte','danke','hallo','guten','morgen','abend','nacht','tag','zeit','geld','preis','euro','pro','person','personen','kosten','inklusive','exklusive']);
    let count = 0;
    for (const w of words) {
      if (germanWords.has(w)) count++;
    }
    return count / words.length;
  }

  function hasBloat(text) {
    if (!text) return false;
    return text.includes('---SPLIT---') || text.includes('--- تسيب ---') || text.includes('---ЦЭП---') || text.includes('---تقسيم---') || text.includes('---РАЗДЕЛЕНИЕ---');
  }

  const stringFields = ['name', 'description', 'short_description', 'category_label', 'meeting_point', 'duration', 'title', 'excerpt', 'content', 'read_time'];

  const results = [];

  for (const row of arRows) {
    const entity = getEntityName(row);
    const findings = [];

    // Check string fields
    for (const field of stringFields) {
      const val = row[field];
      if (!val || val.length === 0) continue;

      const arRatio = arabicRatio(val);
      const deRatio = germanRatio(val);
      const bloat = hasBloat(val);

      if (bloat) {
        findings.push({ field, issue: 'BLOATED', arRatio: (arRatio * 100).toFixed(0) + '%', deRatio: (deRatio * 100).toFixed(0) + '%', len: val.length });
      } else if (deRatio > 0.15 && arRatio < 0.3) {
        findings.push({ field, issue: 'GERMAN_NOT_ARABIC', arRatio: (arRatio * 100).toFixed(0) + '%', deRatio: (deRatio * 100).toFixed(0) + '%', len: val.length });
      } else if (arRatio > 0.3 && deRatio < 0.05) {
        // Looks fine - actually Arabic
      } else if (arRatio > 0.05 && deRatio > 0.05) {
        findings.push({ field, issue: 'MIXED', arRatio: (arRatio * 100).toFixed(0) + '%', deRatio: (deRatio * 100).toFixed(0) + '%', len: val.length });
      } else if (arRatio < 0.3 && deRatio < 0.05) {
        // Neither strongly Arabic nor German - might be English or other
        findings.push({ field, issue: 'NEITHER_AR_DE', arRatio: (arRatio * 100).toFixed(0) + '%', deRatio: (deRatio * 100).toFixed(0) + '%', len: val.length });
      }
    }

    // Check JSON array fields for bloat
    const arrayFields = ['highlights', 'included', 'not_included', 'faqs'];
    for (const field of arrayFields) {
      const val = row[field];
      if (!val || !Array.isArray(val) || val.length === 0) continue;
      // Check if array items contain bloat separators or are German
      const joined = val.join(' ');
      if (hasBloat(joined)) {
        findings.push({ field, issue: 'BLOATED_IN_ARRAY', count: val.length });
      } else {
        const deRatio = germanRatio(joined);
        const arRatio = arabicRatio(joined);
        if (deRatio > 0.15 && arRatio < 0.3) {
          findings.push({ field, issue: 'GERMAN_NOT_ARABIC_IN_ARRAY', arRatio: (arRatio * 100).toFixed(0) + '%', deRatio: (deRatio * 100).toFixed(0) + '%', count: val.length });
        } else if (arRatio < 0.3 && deRatio < 0.05 && val.length > 0) {
          findings.push({ field, issue: 'NEITHER_AR_DE_IN_ARRAY', arRatio: (arRatio * 100).toFixed(0) + '%', deRatio: (deRatio * 100).toFixed(0) + '%', count: val.length });
        }
      }
    }

    if (findings.length > 0) {
      results.push({ entity, table: row.table_name, findings });
    }
  }

  // Output results
  console.log('\n========================================');
  console.log('AR LOCALE QUALITY AUDIT');
  console.log('========================================\n');

  for (const r of results) {
    console.log('[' + r.table + '] ' + r.entity);
    for (const f of r.findings) {
      let extra = '';
      if (f.arRatio) extra += ' AR=' + f.arRatio;
      if (f.deRatio) extra += ' DE=' + f.deRatio;
      if (f.len) extra += ' len=' + f.len;
      if (f.count) extra += ' items=' + f.count;
      console.log('  ' + f.field + ': ' + f.issue + extra);
    }
    console.log('');
  }

  console.log('========================================');
  console.log('SUMMARY');
  console.log('Total AR rows scanned: ' + (arRows?.length || 0));
  console.log('Rows with problems: ' + results.length);
  console.log('Rows clean: ' + ((arRows?.length || 0) - results.length));

  const issueCounts = {};
  for (const r of results) {
    for (const f of r.findings) {
      issueCounts[f.issue] = (issueCounts[f.issue] || 0) + 1;
    }
  }
  console.log('\nIssue breakdown:');
  for (const [issue, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
    console.log('  ' + issue + ': ' + count);
  }
})();
