require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // 1. DE master content for the two target tours (from tours table)
  const { data: t1 } = await db.from('tours').select('*').in('slug', ['family-safari-hurghada', 'mega-safari-hurghada']);
  for (const t of t1) {
    console.log(`\n########## ${t.slug} (tourId ${t.id}) — DE MASTER from tours table ##########`);
    console.log(`name: ${JSON.stringify(t.name)}`);
    console.log(`short_description: ${JSON.stringify(t.short_description)}`);
    console.log(`category_label: ${JSON.stringify(t.category_label)}`);
    console.log(`highlights (${t.highlights?.length}):`);
    t.highlights?.forEach((h, i) => console.log(`  ${i}. ${h}`));
    console.log(`included (${t.included?.length}):`);
    t.included?.forEach((h, i) => console.log(`  ${i}. ${h}`));
    console.log(`not_included (${t.not_included?.length}):`);
    t.not_included?.forEach((h, i) => console.log(`  ${i}. ${h}`));
    console.log(`faqs (${t.faqs?.length}):`);
    t.faqs?.forEach((f, i) => console.log(`  ${i}. Q: ${f?.question}\n     A: ${f?.answer}`));
    console.log(`description (first 400): ${JSON.stringify(t.description?.slice(0, 400))}`);
  }

  // 2. Sample flagged itineraries
  const slugs = ['private-speedboot-tour-orange-bay-hurghada', 'glasbodenboot-hurghada-mit-schnorcheln', 'makadi-water-park-hurghada-mittagessen-transfer'];
  const { data: tours } = await db.from('tours').select('id,slug').in('slug', slugs);
  const ids = tours.map(t => t.id);
  const { data: trs } = await db.from('content_translations').select('row_id,locale,content').eq('table_name','tours').in('row_id', ids);
  const byId = {}; for (const t of tours) byId[t.id] = t;
  console.log('\n\n########## SAMPLE FLAGGED ITINERARIES (content field) ##########');
  for (const tr of trs) {
    if (tr.locale === 'de') continue;
    const slug = byId[tr.row_id]?.slug;
    console.log(`\n--- ${slug} [${tr.locale}] ---`);
    console.log(JSON.stringify(tr.content).slice(0, 700));
  }
})();
