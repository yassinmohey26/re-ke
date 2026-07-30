require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');

// Pick the cleanest tour for test: private-delfin-tour-hurghada (no price divergence, 3-col, stable)
const TEST_SLUG = 'private-delfin-tour-hurghada';

async function main() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 1. Fetch tour + all locale translations
  const { data: tours } = await db.from('tours').select('*');
  const tour = tours.find(t => t.slug === TEST_SLUG);
  if (!tour) { console.log('Tour not found'); return; }

  const { data: allCt } = await db.from('content_translations')
    .select('*')
    .eq('table_name', 'tours')
    .eq('row_id', tour.id);

  console.log('=== TOUR:', tour.name, '===');
  console.log('Slug:', tour.slug);
  console.log('');

  // 2. Parse the HTML table from tours.description (DE source)
  const tableHtml = tour.description.match(/<table[^>]*>[\s\S]*?<\/table>/)?.[0];
  if (!tableHtml) { console.log('No pricing table found'); return; }

  const allRows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
  const headerCells = [...allRows[0][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
    .map(h => h[1].replace(/<[^>]+>/g, '').trim());

  const dataRows = allRows.slice(1).map(r => {
    const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)];
    return cells.map(c => c[1].replace(/<[^>]+>/g, '').trim());
  });

  console.log('Table source: tours.description (DE)');
  console.log('Headers:', headerCells.join(' | '));
  dataRows.forEach(r => console.log('  ' + r.join(' | ')));
  console.log('');

  // 3. Extract pricing_tiers
  // Column mapping: 0=participants, 1=vehicle (if 3-col), last=price
  const hasVehicle = headerCells.some(h => /fahrzeug|boot|vehicle|boat/i.test(h));
  const colCount = headerCells.length;
  
  const pricingTiers = dataRows.map(r => {
    // Parse participants range: "1 Person" -> {min:1,max:1}, "3 – 4 Personen" -> {min:3,max:4}
    const participantText = r[0];
    const numbers = participantText.match(/\d+/g);
    let minP, maxP;
    if (numbers && numbers.length >= 2) {
      minP = parseInt(numbers[0]);
      maxP = parseInt(numbers[1]);
    } else if (numbers && numbers.length === 1) {
      minP = parseInt(numbers[0]);
      maxP = parseInt(numbers[0]);
    } else {
      minP = 1; maxP = 1;
    }

    // Parse price: "350 € p.P." -> 350, "kostenlos" -> 0
    const priceText = r[colCount - 1];
    const priceMatch = priceText.match(/(\d[\d\s]*\d|\d)/);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : 0;
    const isFree = /kostenlos|free|gratis|ingyenes|бесплатно|gratuit/i.test(priceText);

    // Parse vehicle (if 3-col)
    let vehicle = null;
    if (hasVehicle) {
      const vText = r[1];
      if (/limousine|sedan|limo/i.test(vText)) vehicle = 'sedan';
      else if (/minibus|mini.?bus/i.test(vText)) vehicle = 'minibus';
      else if (/speedboot|speed.?boat/i.test(vText)) vehicle = 'speedboat';
      else if (/boot|boat/i.test(vText)) vehicle = 'boat';
      else vehicle = 'sedan'; // default
    }

    return {
      min: minP,
      max: maxP,
      ...(vehicle ? { vehicle } : {}),
      price: isFree ? 0 : price
    };
  });

  console.log('=== EXTRACTED pricing_tiers (once per tour) ===');
  console.log(JSON.stringify(pricingTiers, null, 2));
  console.log('');

  // 4. Build pricing_labels for all 6 locales
  // First, parse the labels from each locale's existing HTML table
  const allLocales = ['de', 'en', 'ar', 'fr', 'hu', 'ru'];
  
  // DE labels: from tours.description
  const deLabels = {
    header_participants: headerCells[0],
    header_vehicle: hasVehicle ? headerCells[1] : null,
    header_price: headerCells[colCount - 1],
    person_singular: 'Person',
    person_plural: 'Personen',
    vehicle_sedan: hasVehicle ? dataRows.find(r => /limousine/i.test(r[1]))?.[1] || 'Private Limousine' : null,
    vehicle_minibus: hasVehicle ? dataRows.find(r => /minibus/i.test(r[1]))?.[1] || 'Privater Minibus' : null,
    vehicle_speedboat: hasVehicle ? dataRows.find(r => /speedboot/i.test(r[1]))?.[1] || 'Privates Speedboot' : null,
    vehicle_boat: hasVehicle ? dataRows.find(r => /boot/i.test(r[1]) && !/speedboot/i.test(r[1]))?.[1] || 'Privates Boot' : null,
    price_suffix: 'p.P.',
    free: 'kostenlos',
    from_label: 'ab'
  };
  // Clean nulls
  Object.keys(deLabels).forEach(k => { if (deLabels[k] === null) delete deLabels[k]; });

  console.log('=== PROPOSED pricing_labels per locale ===');
  console.log('de:', JSON.stringify(deLabels, null, 2));

  // For each other locale, extract labels from existing CT HTML
  for (const loc of allLocales) {
    if (loc === 'de') continue;
    const ct = allCt.find(c => c.locale === loc);
    if (!ct) { console.log(loc + ': NO CT ROW FOUND'); continue; }
    
    const ctTable = ct.description?.match(/<table[^>]*>[\s\S]*?<\/table>/)?.[0];
    if (!ctTable) { console.log(loc + ': NO TABLE'); continue; }

    const ctAllRows = [...ctTable.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
    const ctHeaders = [...ctAllRows[0][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
      .map(h => h[1].replace(/<[^>]+>/g, '').trim());
    const ctData = ctAllRows.slice(1).map(r => {
      const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)];
      return cells.map(c => c[1].replace(/<[^>]+>/g, '').trim());
    });

    const ctHasVehicle = ctHeaders.some(h => /fahrzeug|boot|vehicle|boat/i.test(h));
    const labelData = {
      header_participants: ctHeaders[0],
      header_vehicle: ctHasVehicle ? ctHeaders[1] : deLabels.header_vehicle || null,
      header_price: ctHeaders[ctHeaders.length - 1],
      person_singular: ctData[0]?.[0]?.includes('Person') ? 'Person' : ctData[0]?.[0]?.match(/^\d+\s*(\S+)/)?.[1] || 'Person',
      person_plural: ctData[1]?.[0]?.match(/^\d+\s*(\S+)/)?.[1] || 'Personen',
      vehicle_sedan: ctHasVehicle ? ctData.find(r => /limousine/i.test(r[1]))?.[1] : deLabels.vehicle_sedan,
      vehicle_minibus: ctHasVehicle ? ctData.find(r => /minibus/i.test(r[1]))?.[1] : deLabels.vehicle_minibus,
      vehicle_speedboat: ctHasVehicle ? ctData.find(r => /speedboot/i.test(r[1]))?.[1] : deLabels.vehicle_speedboat,
      vehicle_boat: ctHasVehicle ? ctData.find(r => /boot/i.test(r[1]) && !/speedboot/i.test(r[1]))?.[1] : deLabels.vehicle_boat,
      price_suffix: 'p.P.',
      free: ctData[0]?.[ctData[0].length - 1]?.match(/kostenlos|free|gratis|ingyenes|бесплатно|gratuit/i)?.[0] || deLabels.free,
      from_label: 'ab'
    };
    // Clean nulls
    Object.keys(labelData).forEach(k => { if (labelData[k] === null) delete labelData[k]; });

    // Flag issues
    const issues = [];
    if (labelData.person_plural && /Personen/i.test(labelData.person_plural) && loc !== 'de' && loc !== 'en') {
      issues.push('person_plural still German "Personen"');
    }
    if (labelData.vehicle_sedan && /Limousine/i.test(labelData.vehicle_sedan) && loc !== 'de' && loc !== 'en') {
      issues.push('vehicle_sedan still German "Limousine"');
    }

    console.log(loc + ':', JSON.stringify(labelData, null, 2));
    if (issues.length) {
      console.log('  ⚠ Issues: ' + issues.join(', '));
    }
  }

  // 5. Show current vs proposed rendering comparison
  console.log('\n=== CURRENT RENDERING vs PROPOSED ===');
  console.log('Current (DE HTML table):');
  console.log(tableHtml.substring(0, 500));
  console.log('...');
  
  console.log('\nProposed: pricing_tiers JSON + pricing_labels[de] -> dynamic component');
  console.log('The component will render an identical <table class="tour-pricing-table">');
  console.log('by combining the JSON data with locale labels at display time.');
}

main().catch(e => { console.error(e); process.exit(1); });
