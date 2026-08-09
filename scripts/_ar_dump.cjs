/* READ-ONLY — dump DE (tours) vs AR (content_translations) faqs + list fields to a local JSON file. No DB writes. */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours, error: te } = await db.from('tours')
    .select('id, slug, name, faqs, highlights, included, not_included')
    .eq('active', true)
    .order('slug', { ascending: true });
  if (te) { console.error('tours err', te.message); process.exit(1); }

  const { data: arRows, error: ae } = await db.from('content_translations')
    .select('row_id, faqs, highlights, included, not_included, description')
    .eq('table_name', 'tours')
    .eq('locale', 'ar');
  if (ae) { console.error('ar err', ae.message); process.exit(1); }

  const arByRow = Object.fromEntries((arRows || []).map(r => [r.row_id, r]));

  const out = [];
  let missingCt = 0;
  for (const t of tours || []) {
    const ar = arByRow[t.id];
    if (!ar) { missingCt++; out.push({ slug: t.slug, arRowMissing: true }); continue; }
    out.push({
      slug: t.slug,
      name: t.name,
      de: {
        faqs: t.faqs || [],
        highlights: t.highlights || [],
        included: t.included || [],
        not_included: t.not_included || [],
      },
      ar: {
        faqs: ar.faqs || [],
        highlights: ar.highlights || [],
        included: ar.included || [],
        not_included: ar.not_included || [],
        description: ar.description || '',
      },
    });
  }

  fs.writeFileSync(path.join(__dirname, 'ar_dump.json'), JSON.stringify(out, null, 1), 'utf8');
  console.log(`Wrote ar_dump.json: ${out.length} tours, ${missingCt} missing AR rows`);
  for (const o of out) {
    if (o.arRowMissing) { console.log(`MISSING AR ROW: ${o.slug}`); continue; }
    console.log(`${o.slug} | faqs ${o.de.faqs.length}/${o.ar.faqs.length} | hi ${o.de.highlights.length}/${o.ar.highlights.length} | inc ${o.de.included.length}/${o.ar.included.length} | notInc ${o.de.not_included.length}/${o.ar.not_included.length}`);
  }
})();
