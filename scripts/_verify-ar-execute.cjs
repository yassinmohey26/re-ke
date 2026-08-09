const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local', quiet: true });

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DIR = __dirname;
const FIELDS = ['faqs', 'highlights', 'included', 'not_included'];
const CORRUPTIONS = ['الكORNISH', 'מתנות', 'couples', 'uitable', 'نموذاجاً'];

// --- canonical compare (ignores JSON object key order) ---
function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

// --- parse approved AFTER-state from DRYRUN_AR_FIX_SCRIPT_OUTPUT.md ---
function parseAfter(file) {
  const md = fs.readFileSync(file, 'utf8');
  const expected = {};
  const tourRe = /### Tour: `([^`]+)`/g;
  let m;
  const tourIdx = [];
  while ((m = tourRe.exec(md))) tourIdx.push({ slug: m[1], at: m.index + m[0].length });
  for (let i = 0; i < tourIdx.length; i++) {
    const seg = md.slice(tourIdx[i].at, i + 1 < tourIdx.length ? tourIdx[i + 1].at - 13 : undefined);
    expected[tourIdx[i].slug] = {};
    const fieldRe = /#### (\w+) — \d+ ops([\s\S]*?)(?=#### |$)/g;
    let fm;
    while ((fm = fieldRe.exec(seg))) {
      const field = fm[1];
      const after = fm[2].indexOf('AFTER:');
      const start = fm[2].indexOf('```json', after);
      const end = fm[2].indexOf('```', start + 7);
      expected[tourIdx[i].slug][field] = JSON.parse(fm[2].slice(start + 7, end));
    }
  }
  return expected;
}

const expected = parseAfter(path.join(DIR, 'DRYRUN_AR_FIX_SCRIPT_OUTPUT.md'));

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug');
  const { data: ars } = await db
    .from('content_translations')
    .select('id, row_id, name, faqs, highlights, included, not_included')
    .eq('table_name', 'tours')
    .eq('locale', 'ar');
  if (!Array.isArray(tours) || !Array.isArray(ars)) throw new Error('DB read failed');

  const slugToId = new Map(tours.map(t => [t.slug, t.id]));
  const arByRow = new Map(ars.map(r => [r.row_id, r]));

  // 1) exact match vs approved after-state
  const out = [];
  let tourCount = 0, fieldCount = 0, mismatches = 0;
  for (const slug of Object.keys(expected)) {
    const rowId = slugToId.get(slug);
    const live = rowId ? arByRow.get(rowId) : null;
    if (!live) { out.push(`!! NO AR ROW for ${slug}`); mismatches++; continue; }
    tourCount++;
    for (const f of Object.keys(expected[slug])) {
      const a = canon(live[f] || null);
      const b = canon(expected[slug][f]);
      fieldCount++;
      if (a === b) {
        out.push(`OK  ${slug}.${f}`);
      } else {
        mismatches++;
        out.push(`MISMATCH ${slug}.${f}`);
        out.push(`  live: ${a}`);
        out.push(`  want: ${b}`);
      }
    }
  }
  out.push('');
  out.push(`Matched fields: ${fieldCount - mismatches}/${fieldCount} across ${tourCount} tours. Mismatches: ${mismatches}`);

  // 2) corruption tokens across all 19 batch tours, all 4 fields
  out.push('');
  out.push('Corruption scan (batch tours, all 4 fields):');
  const found = [];
  for (const slug of Object.keys(expected)) {
    const live = arByRow.get(slugToId.get(slug));
    if (!live) continue;
    for (const f of FIELDS) {
      for (const item of live[f] || []) {
        const s = typeof item === 'string' ? item : (item.question || '') + ' ' + (item.answer || '');
        for (const t of CORRUPTIONS) if (s.includes(t)) found.push(`${t} in [${slug}].${f}`);
      }
    }
  }
  if (found.length) { out.push('  REMAINING CORRUPTIONS: ' + JSON.stringify(found)); }
  else { out.push('  0 remaining corruption tokens in all 19 tours.'); }

  // 3) untouched-outside-batch check vs ar_dump.json (pre-execution snapshot)
  out.push('');
  out.push('Untouched check vs ar_dump.json (anything outside approved slug+field must be identical):');
  let untouched = 0, touched = 0;
  const dump = JSON.parse(fs.readFileSync(path.join(DIR, 'ar_dump.json'), 'utf8'));
  for (const d of dump) {
    const rowId = slugToId.get(d.slug);
    const live = rowId ? arByRow.get(rowId) : null;
    if (!live) { out.push(`!! no live AR row for ${d.slug}`); continue; }
    const approvedFields = expected[d.slug] ? Object.keys(expected[d.slug]) : [];
    for (const f of FIELDS) {
      if (approvedFields.includes(f)) continue; // approved to change
      const a = canon(live[f] || null);
      const b = canon(d.ar[f] || null);
      if (a === b) untouched++;
      else { touched++; out.push(`CHANGED OUTSIDE BATCH: ${d.slug}.${f}`); }
    }
  }
  out.push(`  Fields outside approved list that changed: ${touched} (expected 0). Untouched-match: ${untouched}.`);

  // 4) spot-check the two leftover FAQ fixes
  out.push('');
  const ss = arByRow.get(slugToId.get('super-safari-hurghada'));
  const t2 = arByRow.get(slugToId.get('2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben'));
  const ssQ = ss ? ss.faqs.find(f => f.question === 'ما الفعاليات المشمولة؟') : null;
  const t2Q = t2 ? t2.faqs.find(f => f.question === 'هل الوجبات مشمولة أثناء الرحلة؟') : null;
  out.push('Spot checks:');
  out.push('  super-safari "ما الفعاليات المشمولة؟" -> ' + (ssQ ? ssQ.answer : 'MISSING'));
  out.push('  2-tages "هل الوجبات مشمولة أثناء الرحلة؟" -> ' + (t2Q ? t2Q.answer : 'MISSING'));

  fs.writeFileSync(path.join(DIR, '_verify-ar-execute.txt'), out.join('\n'));
  console.log(out.join('\n'));
  process.exit(mismatches ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
