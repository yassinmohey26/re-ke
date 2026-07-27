const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const PAGES_DIR = 'C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\wp-pages';

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#8211;/g, '\u2013').replace(/&#8212;/g, '\u2014')
    .replace(/&#038;/g, '&').replace(/&#8217;/g, '\u2019').replace(/&#8220;/g, '\u201c')
    .replace(/&#8221;/g, '\u201d').replace(/&euro;/g, '\u20ac').replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n').trim();
}

function extractItineraryFromHtml(li) {
  const $li = cheerio.load(li);
  const strong = $li('strong').first();
  if (strong.length) {
    const title = cleanText(strong.text());
    let content = cleanText($li.html());
    content = content.replace(title, '').replace(/\n{2,}/g, '\n').trim();
    return { title, content };
  }
  return { title: '', content: cleanText(li) };
}

async function main() {
  const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));
  const { data: tours } = await sb.from('tours').select('id,slug').eq('locale', 'de');
  const slugToId = {};
  for (const t of tours) slugToId[t.slug] = t.id;

  let updated = 0;
  for (const file of files) {
    const slug = file.replace('.html', '');
    const tourId = slugToId[slug];
    if (!tourId) continue;

    const html = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');
    const $ = cheerio.load(html);

    const itinerary = [];
    const ablaufWidget = $('[id="ablauf"]').closest('.elementor-widget-text-editor');
    if (ablaufWidget.length) {
      ablaufWidget.find('li').each((_, el) => {
        const item = extractItineraryFromHtml($.html(el));
        if (item.title || item.content) itinerary.push(item);
      });
    }

    if (itinerary.length > 0) {
      const { error } = await sb.from('tours').update({ itinerary, updated_at: new Date().toISOString() }).eq('id', tourId);
      if (error) console.log(`ERROR: ${slug}: ${error.message}`);
      else { console.log(`OK: ${slug}: ${itinerary.length} steps`); updated++; }
    }
  }
  console.log(`\nDone: ${updated} tours updated with fixed itineraries`);
}

main().catch(console.error);
