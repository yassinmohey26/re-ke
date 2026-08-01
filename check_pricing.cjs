const fs = require('fs');
const path = require('path');
const envRaw = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
for (const line of envRaw.split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue;
  const i = line.indexOf('=');
  if (i > 0) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
}
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const { data: tours, error } = await supabase.from('tours').select('id, slug, description, discount').limit(60);
  if (error) { console.log('ERR', error.message); return; }
  const ids = tours.map(t => t.id);
  const { data: trs } = await supabase.from('content_translations').select('row_id, locale, description').eq('table_name','tours').in('row_id', ids);
  const trMap = {};
  for (const tr of trs || []) (trMap[tr.row_id] = trMap[tr.row_id] || {})[tr.locale] = tr.description || '';
  let shown = 0, discOnly = 0;
  for (const t of tours) {
    const baseHas = /tour-pricing-table|Teilnehmer|Preis pro Person/i.test(t.description || '');
    const trHas = {};
    for (const loc of Object.keys(trMap[t.id] || {})) trHas[loc] = /tour-pricing-table|Teilnehmer|Preis pro Person/i.test(trMap[t.id][loc] || '');
    const discTiers = Array.isArray(t.discount?.pricingTiers) ? t.discount.pricingTiers.length : 0;
    const anyTr = Object.values(trHas).some(Boolean);
    if (baseHas || anyTr || discTiers > 0) {
      shown++;
      if (discTiers > 0 && !baseHas && !anyTr) discOnly++;
      console.log(`\n### ${t.slug}`);
      console.log(`  base: ${baseHas}  | disc.pricingTiers: ${discTiers}  | tr: ${JSON.stringify(trHas)}`);
    }
  }
  console.log(`\n--- tours with ANY pricing: ${shown}/${tours.length} | discount-only: ${discOnly}`);
})();
