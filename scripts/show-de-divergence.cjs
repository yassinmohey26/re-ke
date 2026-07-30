require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: tours } = await db.from('tours').select('*').eq('active', true);
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours');

  console.log('=== DE PRICE DIVERGENCE: tours.description vs content_translations(locale=de) ===\n');

  for (const t of tours) {
    const deDesc = t.description || '';
    const m = deDesc.match(/<table[^>]*>[\s\S]*?<\/table>/);
    if (!m) continue;

    // Parse tours.description (DE)
    const deRows = [...m[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
    const deHeaders = [...deRows[0][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
      .map(h => h[1].replace(/<[^>]+>/g, '').trim());
    const deData = deRows.slice(1).map(r => {
      const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)];
      return cells.map(c => c[1].replace(/<[^>]+>/g, '').trim());
    });

    // Get content_translations row for locale=de
    const ctDe = cts.find(c => c.row_id === t.id && c.locale === 'de');
    let ctDeData = null;
    if (ctDe && ctDe.description) {
      const ctM = ctDe.description.match(/<table[^>]*>[\s\S]*?<\/table>/);
      if (ctM) {
        const ctRows = [...ctM[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
        if (ctRows.length > 1) {
          ctDeData = ctRows.slice(1).map(r => {
            const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)];
            return cells.map(c => c[1].replace(/<[^>]+>/g, '').trim());
          });
        }
      }
    }

    if (!ctDeData) continue;

    // Compare prices (last column)
    const dePrices = deData.map(r => r[r.length - 1]);
    const ctPrices = ctDeData.map(r => r[r.length - 1]);

    const match = JSON.stringify(dePrices) === JSON.stringify(ctPrices);
    
    if (!match) {
      console.log(`⚠️  ${t.slug.substring(0, 60)}`);
      console.log(`   tours.description headers: ${deHeaders.join(' | ')}`);
      console.log(`   tours.description rows:`);
      deData.forEach(r => console.log(`     ${r.join(' | ')}`));
      console.log(`   content_translations[de] rows:`);
      ctDeData.forEach(r => console.log(`     ${r.join(' | ')}`));
      console.log('');
    } else {
      // Still show for completeness
      // console.log(`✓ ${t.slug.substring(0, 50)}`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
