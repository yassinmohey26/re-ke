require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

const IS_DRY_RUN = !process.argv.includes('--execute');
const LOCALES = ['de', 'en', 'ar', 'fr', 'hu', 'ru'];

function detectVehicle(text) {
  const v = text.toLowerCase();
  if (/limousine|sedan|limo/i.test(v)) return 'sedan';
  if (/minibus|mini.?bus|minivan/i.test(v)) return 'minibus';
  if (/speedboot|speed.?boat|motorboot|motorcsónak|катер|زورق\s*سريع/i.test(v)) return 'speedboat';
  if (/boot|boat|hajó|лодка|lodka|قارب/i.test(v)) return 'boat';
  return null;
}

function extractTiers(tableHtml) {
  const allRows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  if (allRows.length < 2) return null;

  const headers = [...allRows[0][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)]
    .map(h => h[1].replace(/<[^>]+>/g, '').trim());
  const headerText = headers.join(' ').toLowerCase();

  // Skip non-tiered tables (simple price info tables like Arabic style)
  const isTiered =
    /teilnehmer|personen|participants|участники|résztvevők|المشاركون|preis pro person|price per person|személyenkénti|цена за человека/i.test(headerText);

  if (!isTiered) return null;

  const hasVehicle = /fahrzeug|boot|vehicle|boat|bateau|транспорт|jármű|المركبة|القارب/i.test(headerText);

  const dataRows = allRows.slice(1).map(r => {
    const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)];
    return cells.map(c => c[1].replace(/<[^>]+>/g, '').trim());
  }).filter(r => r.length >= 2);

  const tiers = [];
  for (const row of dataRows) {
    const partText = row[0];
    const nums = partText.match(/\d+/g);
    if (!nums) continue;

    const minP = parseInt(nums[0], 10);
    const maxP = parseInt(nums[1] || nums[0], 10);

    const priceText = row[row.length - 1];
    const isFree = /kostenlos|free|gratis|gratuit|ingyenes|бесплатно|مجاني|مجانية/i.test(priceText);
    const pm = priceText.match(/(\d[\d\s]*\d|\d)/);
    const price = isFree ? 0 : (pm ? parseInt(pm[1].replace(/\s/g, ''), 10) : 0);

    let vehicle = null;
    if (hasVehicle) {
      const vText = row[1] || '';
      vehicle = detectVehicle(vText);
    }

    tiers.push({ min: minP, max: maxP, price, ...(vehicle ? { vehicle } : {}) });
  }

  return tiers.length > 0 ? tiers : null;
}

function stripPricingTables(html) {
  return html.replace(/<table[^>]*class="[^"]*tour-pricing-table[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '').trim();
}

async function main() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Fetch all tours
  const { data: tours, error: toursErr } = await db.from('tours').select('*').order('slug');
  if (toursErr) { console.error('Failed to fetch tours:', toursErr); process.exit(1); }
  console.log(`Fetched ${tours.length} tours.\n`);

  // Fetch all content_translations for tours
  const { data: allCts, error: ctsErr } = await db.from('content_translations')
    .select('*')
    .eq('table_name', 'tours');
  if (ctsErr) { console.error('Failed to fetch translations:', ctsErr); process.exit(1); }

  // Index translations by row_id + locale
  const ctMap = {};
  for (const ct of allCts) {
    if (!ctMap[ct.row_id]) ctMap[ct.row_id] = {};
    ctMap[ct.row_id][ct.locale] = ct;
  }

  let hasTableCount = 0;
  let extractedCount = 0;
  const results = [];

  for (const tour of tours) {
    const deCt = ctMap[tour.id]?.de;
    const deDesc = deCt?.description || tour.description || '';

    const tableMatch = deDesc.match(/<table[^>]*class="[^"]*tour-pricing-table[^"]*"[^>]*>[\s\S]*?<\/table>/i);
    if (!tableMatch) continue;
    hasTableCount++;

    const tiers = extractTiers(tableMatch[0]);

    const entry = {
      id: tour.id,
      slug: tour.slug,
      name: tour.name,
      tiers,
      oldDiscount: tour.discount,
      deDescHasTable: true,
      ctUpdates: {},
    };

    if (tiers) {
      extractedCount++;
      // Check what current discount looks like
      const currentDiscount = tour.discount || { active: false, percentage: 0 };
      // Build new discount with pricingTiers
      const newDiscount = {
        ...currentDiscount,
        pricingTiers: tiers,
      };
      entry.newDiscount = newDiscount;

      // Check each locale for HTML tables to strip
      for (const loc of LOCALES) {
        const ct = ctMap[tour.id]?.[loc];
        const ctDesc = ct?.description || '';
        if (ctDesc && stripPricingTables(ctDesc) !== ctDesc) {
          entry.ctUpdates[loc] = {
            id: ct.id,
            oldDesc: ctDesc,
            newDesc: stripPricingTables(ctDesc),
          };
        }
        // Also check tour.description (DE base column)
        if (loc === 'de' && tour.description && stripPricingTables(tour.description) !== tour.description) {
          entry.deBaseNewDesc = stripPricingTables(tour.description);
        }
      }
    }

    results.push(entry);
  }

  // === PRINT SUMMARY ===
  console.log('=== PRICING MIGRATION DRY-RUN ===\n');
  console.log(`Total tours: ${tours.length}`);
  console.log(`Tours with pricing tables: ${hasTableCount}`);
  console.log(`Tours with extractable tiers: ${extractedCount}`);
  console.log(`Mode: ${IS_DRY_RUN ? 'DRY RUN (no writes)' : 'EXECUTE'}\n`);

  for (const r of results) {
    if (!r.tiers) {
      console.log(`❌ ${r.slug}: Has table but could not extract tiers`);
      continue;
    }
    const localeUpdates = Object.keys(r.ctUpdates);
    const deUpdate = r.deBaseNewDesc ? 'tours.description' : '';
    const updates = [...localeUpdates, deUpdate].filter(Boolean).join(', ') || 'none';

    console.log(`✅ ${r.slug}: ${r.tiers.length} tiers, ${r.tiers.some(t => t.vehicle) ? 'has vehicles' : 'no vehicles'}, updates: [${updates}]`);
    console.log(`   Tiers: ${JSON.stringify(r.tiers)}`);
  }

  // Detailed preview
  console.log('\n=== DETAILED PREVIEW ===\n');
  for (const r of results) {
    if (!r.tiers) continue;
    console.log(`--- ${r.slug} ---`);
    console.log(`Discount: ${JSON.stringify(r.oldDiscount)}`);
    console.log(`→ New discount: ${JSON.stringify(r.newDiscount)}`);
    const locUpdates = Object.keys(r.ctUpdates);
    if (locUpdates.length > 0) {
      console.log(`CT updates: ${locUpdates.join(', ')}`);
      for (const loc of locUpdates) {
        const u = r.ctUpdates[loc];
        const oldLen = u.oldDesc.length;
        const newLen = u.newDesc.length;
        console.log(`  ${loc}: ${oldLen} → ${newLen} chars (removed ${oldLen - newLen} chars)`);
      }
    }
    if (r.deBaseNewDesc) {
      console.log(`  tours.description: stripped (table removed)`);
    }
    console.log('');
  }

  // === EXECUTE ===
  if (!IS_DRY_RUN) {
    console.log('\n=== EXECUTING MIGRATION ===\n');
    let updated = 0;
    let ctUpdated = 0;

    for (const r of results) {
      if (!r.tiers) continue;

      // Update tours.discount
      const { error: discErr } = await db.from('tours')
        .update({ discount: r.newDiscount })
        .eq('id', r.id);
      if (discErr) {
        console.error(`  FAILED discount update for ${r.slug}: ${discErr.message}`);
        continue;
      }
      updated++;

      // Update tours.description if needed
      if (r.deBaseNewDesc) {
        const { error: descErr } = await db.from('tours')
          .update({ description: r.deBaseNewDesc })
          .eq('id', r.id);
        if (descErr) console.error(`  FAILED desc update for ${r.slug}: ${descErr.message}`);
      }

      // Update content_translations
      for (const loc of Object.keys(r.ctUpdates)) {
        const u = r.ctUpdates[loc];
        const { error: ctErr } = await db.from('content_translations')
          .update({ description: u.newDesc })
          .eq('id', u.id);
        if (ctErr) {
          console.error(`  FAILED ct update for ${r.slug}/${loc}: ${ctErr.message}`);
        } else {
          ctUpdated++;
        }
      }
    }

    console.log(`\nDone. Updated ${updated} tours discount + ${ctUpdated} content_translations descriptions.`);
  } else {
    console.log('\nDry-run complete. Run with --execute to apply changes.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
