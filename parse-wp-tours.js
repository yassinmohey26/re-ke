const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const PAGES_DIR = 'C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\wp-pages';
const OUT_FILE = 'C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\scraped-tours.json';

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
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#038;/g, '&')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201c')
    .replace(/&#8221;/g, '\u201d')
    .replace(/&euro;/g, '\u20ac')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));
console.log(`Found ${files.length} HTML files to parse\n`);

const results = [];

for (const file of files) {
  const slug = file.replace('.html', '');
  const html = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');
  const $ = cheerio.load(html);
  
  const result = { slug };
  
  // Title - get from the heading widget after availability widget
  const allH2 = $('h2.elementor-heading-title');
  result.title = '';
  allH2.each((_, el) => {
    const text = $(el).text().trim();
    if (text && !text.startsWith('Unternehmen') && !text.startsWith('Leistungen') && !text.startsWith('Hilfe') && !text.startsWith('Folgen') && text.length > 5) {
      if (!result.title) result.title = text;
    }
  });
  
  // Overview data
  const overviewItems = [];
  $('.togo-st-overview ul li').each((_, el) => {
    const name = $(el).find('.name').text().trim().replace(':', '');
    const value = $(el).find('.value').text().trim();
    if (name && value) overviewItems.push({ name, value });
  });
  result.overview = overviewItems;
  
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
  
  // Itinerary
  result.itinerary = [];
  const ablaufWidget = $('[id="ablauf"]').closest('.elementor-widget-text-editor');
  if (ablaufWidget.length) {
    ablaufWidget.find('li').each((_, el) => {
      const text = cleanText($(el).text());
      if (text) result.itinerary.push(text);
    });
  }
  
  // Price table
  result.price_table = [];
  const preisWidget = $('[id="preis"]').closest('.elementor-widget-text-editor');
  if (preisWidget.length) {
    preisWidget.find('tbody tr').each((_, tr) => {
      const cells = [];
      $(tr).find('td').each((_, td) => {
        cells.push(cleanText($(td).text()));
      });
      if (cells.length) result.price_table.push(cells);
    });
  }
  
  // Child pricing
  result.child_pricing = [];
  $('.togo-icon-list .togo-icon-list-item-title').each((_, el) => {
    const text = cleanText($(el).text());
    if (text) result.child_pricing.push(text);
  });
  
  // Cancellation
  result.cancellation = '';
  const cancelWidget = $('[id="cancellation"]').closest('.elementor-widget-text-editor');
  if (cancelWidget.length) {
    result.cancellation = cleanText(cancelWidget.find('.elementor-widget-container').html());
  }
  
  results.push(result);
  
  const status = [
    `desc=${result.description?.length || 0}ch`,
    `hl=${result.highlights.length}`,
    `inc=${result.included.length}`,
    `exc=${result.not_included.length}`,
    `faq=${result.faqs.length}`,
    `it=${result.itinerary.length}`
  ].join(', ');
  console.log(`${slug}: ${status}`);
}

fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2));
console.log(`\nWrote ${results.length} parsed tours to ${OUT_FILE}`);

// Stats
let totalDesc = 0, totalFaqs = 0, totalInc = 0, totalExc = 0, totalHl = 0;
for (const r of results) {
  totalDesc += (r.description?.length || 0);
  totalFaqs += r.faqs.length;
  totalInc += r.included.length;
  totalExc += r.not_included.length;
  totalHl += r.highlights.length;
}
console.log(`\nTotals: desc=${totalDesc}ch, faqs=${totalFaqs}, inc=${totalInc}, exc=${totalExc}, hl=${totalHl}`);
