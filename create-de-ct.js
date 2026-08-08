require('dotenv').config({ path: require('path').join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const scraped = JSON.parse(fs.readFileSync('C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\scraped-tours.json', 'utf8'));

function textToHtml(text) {
  if (!text) return text;
  if (text.includes('<')) return text;
  return text.split('\n').filter(l => l.trim()).map(l => `<p>${l.trim()}</p>`).join('\n');
}

function extractShortDescription(html) {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim();
  return text.substring(0, 160) + (text.length > 160 ? '...' : '');
}

async function main() {
  const { data: tours } = await sb.from('tours').select('id,slug,name,locale').eq('locale', 'de');
  const slugToId = {};
  for (const t of tours) slugToId[t.slug] = t.id;

  let created = 0;
  let skipped = 0;

  for (const item of scraped) {
    const tourId = slugToId[item.slug];
    if (!tourId) { skipped++; continue; }

    const descHtml = textToHtml(item.description);
    const shortDesc = extractShortDescription(item.description);

    const entry = {
      table_name: 'tours',
      row_id: tourId,
      locale: 'de',
      name: item.title || '',
      short_description: shortDesc,
      description: descHtml,
      highlights: item.highlights || [],
      included: item.included || [],
      not_included: item.not_included || [],
      faqs: item.faqs || [],
      category_label: item.tour_type || '',
    };

    const { error } = await sb.from('content_translations').upsert(entry, {
      onConflict: 'table_name,row_id,locale',
      ignoreDuplicates: false,
    });

    if (error) console.log(`ERROR: ${item.slug}: ${error.message}`);
    else { console.log(`OK: ${item.slug}`); created++; }
  }

  console.log(`\nDone: ${created} DE entries created, ${skipped} skipped`);
}

main().catch(console.error);
