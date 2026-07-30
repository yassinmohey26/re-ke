require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: tours } = await db.from('tours').select('*').eq('active', true);
  const { data: cts } = await db.from('content_translations')
    .select('*')
    .eq('table_name', 'tours');

  const locales = [...new Set(cts.map(c => c.locale))].sort();
  console.log('=== OVERVIEW ===');
  console.log('Tours:', tours.length);
  console.log('Locales:', locales.join(', '));
  console.log('CT rows:', cts.length);

  let tourCount = 0;

  for (const t of tours) {
    const deDesc = t.description || '';
    const m = deDesc.match(/<table[^>]*>[\s\S]*?<\/table>/);
    if (!m) continue;
    tourCount++;

    const allRows = [...m[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
    const dataRows = allRows.slice(1);

    const headers = [...allRows[0][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
      .map(h => h[1].replace(/<[^>]+>/g, '').trim());
    
    const deData = dataRows.map(r => {
      const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)];
      return cells.map(c => c[1].replace(/<[^>]+>/g, '').trim());
    });

    console.log('\n--- Tour:', t.slug.substring(0, 55), '---');
    console.log('Headers:', headers.join(' | '));
    deData.forEach(r => console.log('  ' + r.join(' | ')));

    // Check price consistency per locale
    const refPrices = deData.map(r => r[r.length - 1]);
    let mismatches = [];

    for (const loc of locales) {
      const ct = cts.find(c => c.row_id === t.id && c.locale === loc);
      if (!ct) continue;
      const ctDesc = ct.description || '';
      const ctM = ctDesc.match(/<table[^>]*>[\s\S]*?<\/table>/);
      if (!ctM) continue;
      const ctRows = [...ctM[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
      if (ctRows.length <= 1) continue;
      
      const ctData = ctRows.slice(1).map(r => {
        const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)];
        return cells.map(c => c[1].replace(/<[^>]+>/g, '').trim());
      });
      
      const prices = ctData.map(r => r[r.length - 1]);
      if (JSON.stringify(prices) !== JSON.stringify(refPrices)) {
        mismatches.push({ loc, prices, rows: ctData });
        console.log('  ✗ ' + loc + ' prices differ: ' + JSON.stringify(prices));
      } else {
        // Check if labels are translated or still German
        const labels = ctData.map(r => r[0]);
        const deLabels = deData.map(r => r[0]);
        const headerLocale = [...ctRows[0][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
          .map(h => h[1].replace(/<[^>]+>/g, '').trim());
        const labelsMatchDE = JSON.stringify(labels) === JSON.stringify(deLabels);
        if (labelsMatchDE && loc !== 'de') {
          console.log('  ⚠ ' + loc + ' labels still German: ' + JSON.stringify(labels));
        } else if (loc !== 'de') {
          console.log('  ✓ ' + loc + ' prices OK, labels differ');
        }
      }
    }
  }

  console.log('\n\nTotal with pricing tables:', tourCount, '/', tours.length);
}

main().catch(e => { console.error(e); process.exit(1); });
