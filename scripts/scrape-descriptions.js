const https = require('https');
const fs = require('fs');

const TOURS = [
  "glasbodenboot-hurghada-mit-schnorcheln",
  "orange-bay-insel-schnorchelausflug-hurghada",
  "hula-hula-insel-schnorchelausflug-hurghada",
  "mahmya-insel-ausflug-hurghada",
  "eden-island-schnorchelausflug-hurghada",
  "private-speedboot-tour-orange-bay-hurghada",
  "private-delfin-tour-hurghada",
  "privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang",
  "makadi-water-park-hurghada-mittagessen-transfer",
  "hurghada-shopping-tour-basar-transfer",
  "eintrittskarte-zum-hurghada-grand-aquarium",
  "mini-egypt-park-hurghada",
  "naechtliche-stadtrundfahrt-durch-hurghada-private-tour",
  "el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm",
  "kloester-st-antonius-st-paulus",
  "dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel",
  "privater-tagesausflug-ab-hurghada-dendera-abydos-tempel",
  "luxor-tagesausflug-ab-hurghada",
  "luxor-tagesausflug-heissluftballon-hoteluebernachtung",
  "privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh",
  "kairo-mit-flug-ab-hurghada-pyramiden-museum",
  "privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum",
  "super-safari-hurghada",
  "quad-tour-hurghada-kamelritt",
  "reiten-in-hurghada-strand-wueste-pferde-im-meer",
  "2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben"
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, ' - ')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSection(html, marker, endMarker) {
  const s = html.indexOf(marker);
  if (s === -1) return '';
  if (!endMarker) {
    // Find the next closing tags
    const depth1 = html.indexOf('</div>', s);
    const depth2 = html.indexOf('</div>', depth1 + 6);
    const depth3 = html.indexOf('</div>', depth2 + 6);
    return html.substring(s, depth3 > 0 ? depth3 + 6 : depth1 + 6);
  }
  const e = html.indexOf(endMarker, s + marker.length);
  return html.substring(s, e > 0 ? e : s + 2000);
}

function extractDescription(html) {
  const marker = '<div class="description enable-readmore">';
  const s = html.indexOf(marker);
  if (s === -1) {
    // Fallback: try just 'description enable-readmore'
    const s2 = html.indexOf('description enable-readmore');
    if (s2 === -1) return '';
    const start = html.lastIndexOf('<div', s2);
    // Find matching closing div (3 levels deep from description div)
    let depth = 0;
    let i = start;
    while (i < html.length) {
      const nextOpen = html.indexOf('<div', i + 1);
      const nextClose = html.indexOf('</div>', i + 1);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        i = nextOpen;
      } else {
        if (depth === 0) {
          return html.substring(start, nextClose + 6);
        }
        depth--;
        i = nextClose;
      }
    }
    return '';
  }
  // Find the closing of this div (it's typically 1 level deep)
  let depth = 0;
  let i = s;
  while (i < html.length) {
    const nextOpen = html.indexOf('<div', i + 1);
    const nextClose = html.indexOf('</div>', i + 1);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen;
    } else {
      if (depth === 0) return html.substring(s, nextClose + 6);
      depth--;
      i = nextClose;
    }
  }
  return '';
}

function extractById(html, id) {
  // Find the element with the given id, then extract its content (3 divs deep)
  const marker = `id="${id}"`;
  const s = html.indexOf(marker);
  if (s === -1) return '';
  
  // Find the widget container
  const widgetStart = html.lastIndexOf('<div', s);
  
  // Find the content div (usually 2-3 divs deep)
  let depth = 0;
  let i = widgetStart;
  while (i < html.length) {
    const nextOpen = html.indexOf('<div', i + 1);
    const nextClose = html.indexOf('</div>', i + 1);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen;
    } else {
      depth--;
      i = nextClose + 6;
      if (depth <= 0) break;
    }
  }
  
  return html.substring(widgetStart, i);
}

function extractHighlights(html) {
  const s = html.indexOf('id="highlights"');
  if (s === -1) return [];
  
  // Find the <ul> inside the highlights section
  const ulStart = html.indexOf('<ul>', s);
  const ulEnd = html.indexOf('</ul>', ulStart);
  if (ulStart === -1 || ulEnd === -1) return [];
  
  const ul = html.substring(ulStart, ulEnd + 5);
  const items = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = liRegex.exec(ul)) !== null) {
    // Remove SVG spans and strip tags
    let text = m[1].replace(/<span class="togo-svg-icon">[\s\S]*?<\/span>/gi, '');
    text = stripTags(text);
    if (text.length > 2) items.push(text);
  }
  return items;
}

function extractIncludedExcluded(html) {
  const s = html.indexOf('id="ie"');
  if (s === -1) return { included: [], excluded: [] };
  
  const ieSection = html.substring(s, s + 5000);
  
  const included = [];
  const excluded = [];
  
  const incMatch = ieSection.match(/<ul class="items includes">([\s\S]*?)<\/ul>/);
  if (incMatch) {
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let m;
    while ((m = liRegex.exec(incMatch[1])) !== null) {
      let text = m[1].replace(/<span class="togo-svg-icon">[\s\S]*?<\/span>/gi, '');
      text = stripTags(text);
      if (text.length > 2) included.push(text);
    }
  }
  
  const excMatch = ieSection.match(/<ul class="items excludes">([\s\S]*?)<\/ul>/);
  if (excMatch) {
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let m;
    while ((m = liRegex.exec(excMatch[1])) !== null) {
      let text = m[1].replace(/<span class="togo-svg-icon">[\s\S]*?<\/span>/gi, '');
      text = stripTags(text);
      if (text.length > 2) excluded.push(text);
    }
  }
  
  return { included, excluded };
}

function extractFAQs(html) {
  const s = html.indexOf('id="faqs"');
  if (s === -1) return [];
  
  const faqSection = html.substring(s, s + 10000);
  const faqs = [];
  
  // FAQs are in accordion items
  const questionRegex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  const answerRegex = /<div class="togo-st-faqs-answer">([\s\S]*?)<\/div>/gi;
  
  let qMatch;
  while ((qMatch = questionRegex.exec(faqSection)) !== null) {
    const question = stripTags(qMatch[1]);
    // Find the next answer after this question
    const aStart = qMatch.index + qMatch[0].length;
    const aMatch = faqSection.substring(aStart).match(/<div class="togo-st-faqs-answer">([\s\S]*?)<\/div>/);
    const answer = aMatch ? stripTags(aMatch[1]) : '';
    if (question.length > 5) faqs.push({ question, answer });
  }
  
  return faqs;
}

function extractItinerary(html) {
  const s = html.indexOf('id="ablauf"');
  if (s === -1) return '';
  
  // Find the widget container and extract text content
  const section = html.substring(s, s + 5000);
  const contentMatch = section.match(/<div class="elementor-widget-container">([\s\S]*?)<\/div>\s*<\/div>/);
  if (!contentMatch) return '';
  
  // Get text, replacing <br> with newlines
  let text = contentMatch[1].replace(/<br\s*\/?>/gi, '\n');
  text = stripTags(text);
  return text;
}

async function main() {
  const results = [];
  
  for (let i = 0; i < TOURS.length; i++) {
    const slug = TOURS[i];
    const url = `https://hurghada-reiseplaner.at/trip/${slug}/`;
    console.log(`[${i+1}/${TOURS.length}] ${slug}`);
    
    try {
      const html = await fetchPage(url);
      
      const description = extractDescription(html);
      const itinerary = extractItinerary(html);
      const highlights = extractHighlights(html);
      const { included, excluded } = extractIncludedExcluded(html);
      const faqs = extractFAQs(html);
      
      // Extract meta description
      const metaMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
      const metaDescription = metaMatch ? metaMatch[1] : '';
      
      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/ &#8211;.*$/, '').replace(/ –.*$/, '') : '';
      
      // Clean description HTML
      let descHtml = description;
      // Remove the wrapper div
      descHtml = descHtml.replace(/^<div class="description[^"]*">/, '').replace(/<\/div>$/, '');
      // Remove span color styles
      descHtml = descHtml.replace(/<span[^>]*style="color:\s*#000000;?[^"]*"[^>]*>/gi, '<span>');
      descHtml = descHtml.replace(/<span[^>]*>/gi, '<span>');
      
      console.log(`  desc: ${descHtml.length} chars, itinerary: ${itinerary.length}, highlights: ${highlights.length}, included: ${included.length}, excluded: ${excluded.length}, faqs: ${faqs.length}`);
      
      results.push({
        slug,
        title,
        metaDescription,
        descriptionHtml: descHtml,
        descriptionText: stripTags(descHtml),
        itinerary,
        highlights,
        included,
        excluded,
        faqs
      });
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results.push({ slug, error: err.message });
    }
    
    if (i < TOURS.length - 1) await sleep(1500);
  }
  
  fs.writeFileSync('scripts/tour-descriptions.json', JSON.stringify(results, null, 2));
  console.log(`\nSaved ${results.length} tours to tour-descriptions.json`);
}

main();
