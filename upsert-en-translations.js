require('dotenv').config({ path: require('path').join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const FILES = [
  'C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\en-translations-1-8.json',
  'C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\en-translations-9-17.json',
  'C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\en-translations-18-25.json',
];

function extractShortDescription(html) {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim();
  return text.substring(0, 160) + (text.length > 160 ? '...' : '');
}

async function main() {
  const { data: tours } = await sb.from('tours').select('id,slug').eq('locale', 'de');
  const slugToId = {};
  for (const t of tours) slugToId[t.slug] = t.id;

  let allTranslations = [];
  for (const f of FILES) {
    if (!fs.existsSync(f)) { console.log(`SKIP: ${f} not found`); continue; }
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    allTranslations = allTranslations.concat(data);
    console.log(`Loaded ${data.length} from ${f.split('\\').pop()}`);
  }

  console.log(`Total EN translations: ${allTranslations.length}\n`);

  let updated = 0;
  for (const t of allTranslations) {
    const tourId = slugToId[t.slug];
    if (!tourId) { console.log(`SKIP: ${t.slug} - no tour ID`); continue; }

    const entry = {
      table_name: 'tours',
      row_id: tourId,
      locale: 'en',
      name: t.title || '',
      short_description: extractShortDescription(t.description),
      description: t.description || '',
      highlights: t.highlights || [],
      included: t.included || [],
      not_included: t.not_included || [],
      faqs: t.faqs || [],
      category_label: t.tour_type || '',
    };

    const { error } = await sb.from('content_translations').upsert(entry, {
      onConflict: 'table_name,row_id,locale',
    });

    if (error) console.log(`ERROR: ${t.slug}: ${error.message}`);
    else { console.log(`OK: ${t.slug}`); updated++; }
  }

  console.log(`\nDone: ${updated} EN entries upserted`);
}

main().catch(console.error);
