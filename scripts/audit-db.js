const fs = require('fs');
const path = require('path');
const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(l => {
  const i = l.indexOf('=');
  if (i > 0 && !l.startsWith('#')) {
    env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  }
});
const { createClient } = require('@supabase/supabase-js');
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // 1. Check if there's a translations table
  console.log('=== 1. LOCALE STRUCTURE ===');
  // Check for any tables with 'translat' in name
  const { data: allTables } = await db.from('information_schema.tables').select('table_name').eq('table_schema', 'public');
  const allTableNames = (allTables || []).map(t => t.table_name);
  console.log('All public tables:', allTableNames.join(', '));
  const translatTables = allTableNames.filter(t => t.includes('translat'));
  console.log('Translation-related tables:', translatTables.length > 0 ? translatTables.join(', ') : 'NONE');

  // Check if tours table has locale columns by sampling
  const { data: tourSample } = await db.from('tours').select('id, slug, name, description, short_description, faqs, created_at, duration, meeting_point').limit(5);
  console.log('\n=== TOUR SAMPLE (first 5) ===');
  for (const t of (tourSample || [])) {
    console.log(`\n[${t.slug}] created: ${t.created_at}`);
    console.log(`  name: ${t.name?.substring(0, 60)}`);
    console.log(`  description length: ${t.description?.length}, starts with: ${t.description?.substring(0, 80)}`);
    console.log(`  short_description length: ${t.short_description?.length}, starts with: ${t.short_description?.substring(0, 80)}`);
    console.log(`  duration: ${t.duration}`);
    console.log(`  meeting_point: ${t.meeting_point}`);
    const faqs = t.faqs || [];
    console.log(`  faqs count: ${faqs.length}`);
    if (faqs.length > 0) {
      console.log(`  faq[0]: Q=${faqs[0].question?.substring(0, 60)}  A=${faqs[0].answer?.substring(0, 100)}`);
    }
  }

  // 2. FAQS analysis - find dirty FAQs
  console.log('\n\n=== 2. FAQS CLEANUP ANALYSIS ===');
  const { data: allTours } = await db.from('tours').select('slug, faqs, created_at');
  let totalFaqs = 0;
  let dirtyFaqs = 0;
  const dirtyPatterns = [];
  for (const t of (allTours || [])) {
    const faqs = t.faqs || [];
    for (const faq of faqs) {
      totalFaqs++;
      const q = faq.question || '';
      const a = faq.answer || '';
      const isDirty =
        a.includes('Login to use') ||
        a.includes('Anfrage stellen') ||
        (a.includes('Datum') && a.includes('Gast')) ||
        /<div\s+class=/.test(a);
      if (isDirty) {
        dirtyFaqs++;
        let reason = [];
        if (a.includes('Login to use')) reason.push('Login to use');
        if (a.includes('Anfrage stellen')) reason.push('Anfrage stellen');
        if (a.includes('Datum') && a.includes('Gast')) reason.push('Datum+Gast widget');
        if (/<div\s+class=/.test(a)) reason.push('raw HTML');
        dirtyPatterns.push({ slug: t.slug, q: q.substring(0, 60), a: a.substring(0, 120), reasons: reason.join(', ') });
      }
    }
  }
  console.log(`Total FAQs: ${totalFaqs}, Dirty: ${dirtyFaqs}`);
  console.log('\nDirty FAQs to remove:');
  for (const d of dirtyPatterns) {
    console.log(`  [${d.slug}] Q="${d.q}" A="${d.a}"  REASONS: ${d.reasons}`);
  }

  // 3. Stub descriptions
  console.log('\n\n=== 3. STUB DESCRIPTIONS + MISSING DATA ===');
  const { data: allToursList } = await db.from('tours').select('slug, name, description, short_description, duration, duration_hours, meeting_point, destination, created_at');
  const stubTours = (allToursList || []).filter(t => t.description === 'a' || t.short_description === 'a');
  console.log('Tours with description="a" or short_description="a":', stubTours.length);
  for (const t of (stubTours || [])) {
    console.log(`\n  [${t.slug}] created: ${t.created_at}`);
    console.log(`    name: ${t.name}`);
    console.log(`    description="${t.description}"`);
    console.log(`    short_description="${t.short_description}"`);
    console.log(`    duration="${t.duration}" (hours: ${t.duration_hours})`);
    console.log(`    meeting_point="${t.meeting_point}"`);
    console.log(`    destination="${t.destination}"`);
  }

  // Also check tours with empty duration or meeting_point
  console.log('\n=== Tours with empty duration or meeting_point ===');
  const emptyTours = (allToursList || []).filter(t => !t.duration || !t.meeting_point);
  for (const t of (emptyTours || [])) {
    console.log(`  [${t.slug}] duration="${t.duration}" meeting_point="${t.meeting_point}" dest="${t.destination}"`);
  }

  // 4. Check clean tours from Jul 20
  console.log('\n=== 4. CLEAN TOURS (created >= 2026-07-20) ===');
  const { data: cleanTours } = await db.from('tours').select('slug, name, faqs, created_at').gte('created_at', '2026-07-20');
  for (const t of (cleanTours || [])) {
    const faqs = t.faqs || [];
    console.log(`  [${t.slug}] created: ${t.created_at}, faqs: ${faqs.length}`);
    for (const f of faqs) {
      console.log(`    Q: ${f.question?.substring(0, 60)}`);
      console.log(`    A: ${f.answer?.substring(0, 80)}`);
    }
  }
})();
