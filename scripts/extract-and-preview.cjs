require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const TEST_SLUG = 'private-delfin-tour-hurghada';

const LABELS = {
  de: { header_participants: 'Teilnehmer', header_vehicle: 'Fahrzeug', header_price: 'Preis pro Person', person_singular: 'Person', person_plural: 'Personen', vehicle_sedan: 'Private Limousine', vehicle_minibus: 'Privater Minibus', vehicle_speedboat: 'Privates Speedboot', vehicle_boat: 'Privates Boot', price_suffix: 'p.P.', free: 'kostenlos', from_label: 'ab' },
  en: { header_participants: 'Participants', header_vehicle: 'Vehicle', header_price: 'Price per Person', person_singular: 'Person', person_plural: 'Persons', vehicle_sedan: 'Private Sedan', vehicle_minibus: 'Private Minibus', vehicle_speedboat: 'Private Speedboat', vehicle_boat: 'Private Boat', price_suffix: 'p.P.', free: 'free', from_label: 'from' },
  ar: { header_participants: 'المشاركون', header_vehicle: 'المركبة', header_price: 'السعر للفرد', person_singular: 'شخص', person_plural: 'أشخاص', vehicle_sedan: 'سيارة خاصة', vehicle_minibus: 'حافلة صغيرة خاصة', vehicle_speedboat: 'زورق سريع خاص', vehicle_boat: 'قارب خاص', price_suffix: 'للشخص', free: 'مجاني', from_label: 'من' },
  fr: { header_participants: 'Participants', header_vehicle: 'Véhicule', header_price: 'Prix par personne', person_singular: 'Personne', person_plural: 'Personnes', vehicle_sedan: 'Berline privée', vehicle_minibus: 'Minibus privé', vehicle_speedboat: 'Hors-bord privé', vehicle_boat: 'Bateau privé', price_suffix: '/pers.', free: 'Gratuit', from_label: 'dès' },
  hu: { header_participants: 'Résztvevők', header_vehicle: 'Jármű', header_price: 'Ár személyenként', person_singular: 'fő', person_plural: 'fő', vehicle_sedan: 'Privát limuzin', vehicle_minibus: 'Privát minibusz', vehicle_speedboat: 'Privát motorcsónak', vehicle_boat: 'Privát hajó', price_suffix: '/fő', free: 'Ingyenes', from_label: '-tól' },
  ru: { header_participants: 'Участники', header_vehicle: 'Транспорт', header_price: 'Цена за человека', person_singular: 'чел.', person_plural: 'чел.', vehicle_sedan: 'Частный седан', vehicle_minibus: 'Частный минивэн', vehicle_speedboat: 'Частный катер', vehicle_boat: 'Частная лодка', price_suffix: '/чел.', free: 'Бесплатно', from_label: 'от' },
};

function fmtParticipant(min, max, labels) {
  const lbl = min === 1 && max === 1 ? labels.person_singular : labels.person_plural;
  return min === max ? `${min} ${lbl}` : `${min} \u2013 ${max} ${lbl}`;
}

function fmtPrice(price, labels) {
  if (price === 0) return labels.free;
  return `${price} \u20AC ${labels.price_suffix}`;
}

function getVeh(vehId, labels) {
  const map = { sedan: 'vehicle_sedan', minibus: 'vehicle_minibus', speedboat: 'vehicle_speedboat', boat: 'vehicle_boat' };
  const key = map[vehId];
  return key ? labels[key] : vehId;
}

function renderTableHtml(tiers, hasVehicle, labels, locale) {
  const dir = locale === 'ar' ? ' dir="rtl"' : '';
  let html = `<table class="tour-pricing-table"${dir}>\n<thead>\n<tr>\n`;
  html += `  <th>${labels.header_participants}</th>\n`;
  if (hasVehicle) html += `  <th>${labels.header_vehicle}</th>\n`;
  html += `  <th>${labels.header_price}</th>\n`;
  html += `</tr>\n</thead>\n<tbody>\n`;
  for (const row of tiers) {
    html += `<tr>\n`;
    html += `  <td>${fmtParticipant(row.min, row.max, labels)}</td>\n`;
    if (hasVehicle) html += `  <td>${getVeh(row.vehicle, labels)}</td>\n`;
    html += `  <td>${fmtPrice(row.price, labels)}</td>\n`;
    html += `</tr>\n`;
  }
  html += `</tbody>\n</table>`;
  return html;
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: tours } = await db.from('tours').select('*');
  const tour = tours.find(t => t.slug === TEST_SLUG);
  if (!tour) { console.log('Tour not found'); return; }
  console.log('Tour:', tour.name, '\n');

  const { data: cts } = await db.from('content_translations')
    .select('*')
    .eq('table_name', 'tours')
    .eq('row_id', tour.id);

  // Parse current HTML table from tours.description
  const tableHtml = tour.description.match(/<table[^>]*>[\s\S]*?<\/table>/)?.[0];
  if (!tableHtml) { console.log('No pricing table found'); return; }

  const allRows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
  const headers = [...allRows[0][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
    .map(h => h[1].replace(/<[^>]+>/g, '').trim());
  const dataRows = allRows.slice(1).map(r => {
    const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)];
    return cells.map(c => c[1].replace(/<[^>]+>/g, '').trim());
  });

  const hasVehicle = headers.some(h => /fahrzeug|boot|vehicle|boat/i.test(h));

  // Extract pricing_tiers
  const tiers = dataRows.map(r => {
    const partText = r[0];
    const nums = partText.match(/\d+/g);
    const minP = parseInt(nums?.[0] || '1');
    const maxP = parseInt(nums?.[1] || nums?.[0] || '1');
    const priceText = r[headers.length - 1];
    const pm = priceText.match(/(\d[\d\s]*\d|\d)/);
    const price = pm ? parseInt(pm[1].replace(/\s/g, '')) : 0;
    const isFree = /kostenlos|free|gratis|ingyenes|бесплатно|gratuit/i.test(priceText);
    let vehicle = null;
    if (hasVehicle) {
      const v = r[1];
      if (/limousine|sedan|limo/i.test(v)) vehicle = 'sedan';
      else if (/minibus|mini.?bus/i.test(v)) vehicle = 'minibus';
      else if (/speedboot|speed.?boat/i.test(v)) vehicle = 'speedboat';
      else if (/boot|boat/i.test(v)) vehicle = 'boat';
      else vehicle = 'sedan';
    }
    return { min: minP, max: maxP, ...(vehicle ? { vehicle } : {}), price: isFree ? 0 : price };
  });

  console.log('=== Extracted pricing_tiers ===');
  console.log(JSON.stringify(tiers, null, 2));

  // Build preview HTML
  function stripHtml(html) {
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }

  let previewHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pricing Table Preview</title>';
  previewHtml += `<style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 40px auto; padding: 0 20px; background: #f5f5f5; }
    h1 { font-size: 20px; margin-bottom: 8px; }
    h2 { font-size: 16px; margin: 30px 0 10px; color: #333; }
    .tour-name { font-size: 14px; color: #666; margin-bottom: 30px; }
    .comparison { display: flex; gap: 30px; flex-wrap: wrap; }
    .column { flex: 1; min-width: 320px; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .column h3 { font-size: 14px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #eee; }
    .column.old h3 { color: #c00; border-color: #c00; }
    .column.new h3 { color: #080; border-color: #080; }
    .tour-pricing-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .tour-pricing-table th { background: #f0f0f0; padding: 10px 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; }
    .tour-pricing-table td { padding: 10px 12px; border-bottom: 1px solid #eee; }
    .locale-badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 12px; }
    .badge-de { background: #ffd700; color: #000; }
    .badge-en { background: #0070f3; color: #fff; }
    .badge-ar { background: #0a0; color: #fff; }
    .badge-fr { background: #00f; color: #fff; }
    .badge-hu { background: #c00; color: #fff; }
    .badge-ru { background: #d52b1e; color: #fff; }
    table[dir="rtl"] th, table[dir="rtl"] td { text-align: right; }
    .note { background: #fffbe6; border: 1px solid #ffe58f; padding: 12px 16px; border-radius: 6px; font-size: 13px; margin-top: 24px; }
  </style></head><body>`;

  previewHtml += `<h1>Pricing Table Migration Preview</h1>`;
  previewHtml += `<div class="tour-name">Test Tour: <strong>${tour.name}</strong> (${tour.slug})</div>`;

  const LOCALES = ['de', 'en', 'ar', 'fr', 'hu', 'ru'];
  const LOCALE_NAMES = { de: 'DE (German)', en: 'EN (English)', ar: 'AR (Arabic)', fr: 'FR (French)', hu: 'HU (Hungarian)', ru: 'RU (Russian)' };

  for (const loc of LOCALES) {
    previewHtml += `<h2>Locale: ${LOCALE_NAMES[loc]}</h2><div class="comparison">`;

    // LEFT: old HTML table
    previewHtml += `<div class="column old"><h3>${loc === 'de' ? 'CURRENT (tours.description)' : 'CURRENT (content_translations[' + loc + '])'}</h3>`;
    previewHtml += `<div class="locale-badge badge-${loc}">${loc}</div>`;
    let oldTable;
    if (loc === 'de') {
      oldTable = tableHtml;
    } else {
      const ct = cts.find(c => c.locale === loc);
      const ctTable = ct?.description?.match(/<table[^>]*>[\s\S]*?<\/table>/)?.[0];
      oldTable = ctTable || '<em>No table found</em>';
    }
    previewHtml += oldTable;
    previewHtml += `</div>`;

    // RIGHT: new reconstructed table
    previewHtml += `<div class="column new"><h3>NEW (pricing_tiers + pricing_labels)</h3>`;
    previewHtml += `<div class="locale-badge badge-${loc}">${loc}</div>`;
    const newTable = renderTableHtml(tiers, hasVehicle, LABELS[loc], loc);
    previewHtml += newTable;
    previewHtml += `</div>`;

    previewHtml += `</div>`;
  }

  previewHtml += `<div class="note">
    <strong>Note:</strong> The OLD table on the left is the current HTML blob stored per-locale in the database.
    The NEW table on the right is generated dynamically from <code>pricing_tiers</code> (stored once on the tour) +
    <code>pricing_labels</code> (stored once per locale). They should look identical except the labels are now
    properly translated for each locale instead of having leftover German words.
  </div>`;

  previewHtml += '</body></html>';

  const outPath = path.join(__dirname, '..', 'public', 'pricing-preview.html');
  fs.writeFileSync(outPath, previewHtml);
  console.log('\nPreview written to: public/pricing-preview.html');
  console.log('Open in browser to see side-by-side comparison for all 6 locales.\n');

  // Summary for console
  console.log('=== DATA EXTRACTION SUMMARY ===');
  console.log('Tiers:', JSON.stringify(tiers));
  const restOfDesc = tour.description.replace(/<table[^>]*>[\s\S]*?<\/table>/, '').trim();
  console.log('\nNon-table description (would be preserved):');
  console.log(restOfDesc.substring(0, 200) + '...');
}

main().catch(e => { console.error(e); process.exit(1); });
