const https = require('https');
const http = require('http');
const cheerio = require('cheerio');

const SLUGS = [
  '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
  'eden-island-schnorchelausflug-hurghada',
  'eintrittskarte-zum-hurghada-grand-aquarium',
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm',
  'glasbodenboot-hurghada-mit-schnorcheln',
  'hula-hula-insel-schnorchelausflug-hurghada',
  'hurghada-shopping-tour-basar-transfer',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum',
  'kloester-st-antonius-st-paulus',
  'luxor-tagesausflug-ab-hurghada',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'mahmya-insel-ausflug-hurghada',
  'makadi-water-park-hurghada-mittagessen-transfer',
  'mini-egypt-park-hurghada',
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
  'orange-bay-insel-schnorchelausflug-hurghada',
  'private-delfin-tour-hurghada',
  'private-speedboot-tour-orange-bay-hurghada',
  'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'quad-tour-hurghada-kamelritt',
  'super-safari-hurghada'
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&euro;/g, '€')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractListItems($, selector) {
  const items = [];
  $(selector).each((_, el) => {
    const text = cleanText($(el).text());
    if (text) items.push(text);
  });
  return items;
}

async function scrapeTour(slug) {
  const url = `https://hurghada-reiseplaner.at/trip/${slug}/`;
  console.log(`Fetching: ${slug}...`);
  
  try {
    const html = await fetch(url);
    const $ = cheerio.load(html);
    
    const result = { slug, url };
    
    // Title
    result.title = $('h2.elementor-heading-title.elementor-size-default').first().text().trim();
    
    // Overview data (Duration, Guests, Tour type, Pickup)
    const overviewItems = [];
    $('.togo-st-overview ul li').each((_, el) => {
      const name = $(el).find('.name').text().trim().replace(':', '');
      const value = $(el).find('.value').text().trim();
      if (name && value) overviewItems.push({ name, value });
    });
    result.overview = overviewItems;
    
    // Extract specific overview fields
    for (const item of overviewItems) {
      if (item.name === 'Dauer') result.duration = item.value;
      if (item.name === 'Abholung') result.meeting_point = item.value;
      if (item.name === 'Reisende') result.max_guests = item.value;
      if (item.name === 'Tourtyp') result.tour_type = item.value;
    }
    
    // Description
    const descEl = $('.togo-st-overview .description');
    result.description = cleanText(descEl.html());
    
    // Highlights
    result.highlights = [];
    $('.togo-st-highlights ul li').each((_, el) => {
      const text = cleanText($(el).text());
      if (text) result.highlights.push(text);
    });
    
    // Included
    result.included = [];
    $('ul.items.includes li').each((_, el) => {
      const text = cleanText($(el).text());
      if (text) result.included.push(text);
    });
    
    // Not included
    result.not_included = [];
    $('ul.items.excludes li').each((_, el) => {
      const text = cleanText($(el).text());
      if (text) result.not_included.push(text);
    });
    
    // FAQs
    result.faqs = [];
    $('.togo-st-faqs-item').each((_, el) => {
      const question = cleanText($(el).find('.togo-st-faqs-question-title').text());
      const answer = cleanText($(el).find('.togo-st-faqs-answer').html());
      if (question && answer) result.faqs.push({ question, answer });
    });
    
    // Itinerary (from text editor widget)
    result.itinerary = [];
    const ablaufWidget = $('[id="ablauf"]').closest('.elementor-widget-text-editor');
    if (ablaufWidget.length) {
      ablaufWidget.find('li').each((_, el) => {
        const text = cleanText($(el).text());
        if (text) result.itinerary.push(text);
      });
    }
    
    // Price table
    const preisWidget = $('[id="preis"]').closest('.elementor-widget-text-editor');
    if (preisWidget.length) {
      const rows = [];
      preisWidget.find('tbody tr').each((_, tr) => {
        const cells = [];
        $(tr).find('td').each((_, td) => {
          cells.push(cleanText($(td).text()));
        });
        if (cells.length) rows.push(cells);
      });
      result.price_table = rows;
    }
    
    // Child pricing (Kinderermäßigung)
    result.child_pricing = [];
    $('.togo-icon-list .togo-icon-list-item-title').each((_, el) => {
      const text = cleanText($(el).text());
      if (text) result.child_pricing.push(text);
    });
    
    console.log(`  OK: desc=${result.description?.length || 0}ch, highlights=${result.highlights.length}, included=${result.included.length}, not_incl=${result.not_included.length}, faqs=${result.faqs.length}, itinerary=${result.itinerary.length}`);
    
    return result;
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    return { slug, error: err.message };
  }
}

async function main() {
  const results = [];
  for (const slug of SLUGS) {
    const data = await scrapeTour(slug);
    results.push(data);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Write results to JSON
  const fs = require('fs');
  const outPath = 'C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\scraped-tours.json';
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nDone! Wrote ${results.length} tours to ${outPath}`);
  
  // Summary
  let errors = 0;
  for (const r of results) {
    if (r.error) { errors++; console.log(`  ERROR: ${r.slug}: ${r.error}`); }
    else {
      console.log(`  ${r.slug}: desc=${r.description?.length||0}ch, hl=${r.highlights.length}, inc=${r.included.length}, exc=${r.not_included.length}, faq=${r.faqs.length}`);
    }
  }
  console.log(`\n${results.length - errors} succeeded, ${errors} failed`);
}

main().catch(console.error);
