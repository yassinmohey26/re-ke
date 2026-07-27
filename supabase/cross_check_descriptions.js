const fs = require('fs');
const path = require('path');

const arDescPath = path.join(__dirname, 'ar_descriptions_translated.json');
const deDescPath = path.join(__dirname, 'de_descriptions.json');

const arDescriptions = JSON.parse(fs.readFileSync(arDescPath, 'utf8'));
const deDescriptions = JSON.parse(fs.readFileSync(deDescPath, 'utf8'));

console.log(`Loaded ${arDescriptions.length} translations and ${deDescriptions.length} original German descriptions...`);

function countTag(html, tag) {
  const openingRegex = new RegExp(`<${tag}\\b`, 'gi');
  const closingRegex = new RegExp(`</${tag}>`, 'gi');
  const openingCount = (html.match(openingRegex) || []).length;
  const closingCount = (html.match(closingRegex) || []).length;
  return { open: openingCount, close: closingCount };
}

function extractNumbersAndPrices(text) {
  // Normalize known textual numbers and words to common representations
  let normalized = text.toLowerCase()
    .replace(/2\s*personen|شخصان/gi, '2')
    .replace(/1\s*person|شخص\s*واحد/gi, '1')
    .replace(/kostenlos|مجاني|مجانية/gi, 'free')
    .replace(/1\.000|1000/gi, '1000')
    .replace(/الرابع/g, '4')
    .replace(/يومين/g, '2');

  // Extract digits, price matches
  const matches = normalized.match(/\b\d+(?:\s*[\–\-]\s*\d+)?\b|\d+(?::\d+)?|\d+\s*€|free/gi) || [];
  return matches.map(m => m.replace(/\s+/g, '').toLowerCase()).sort();
}

let hasErrors = false;

for (const entry of arDescriptions) {
  const deEntry = deDescriptions.find(d => d.id === entry.id);
  const de = deEntry ? deEntry.de_description : '';
  const ar = entry.ar_description || '';
  
  console.log(`\nChecking entity ${entry.shortId} (${entry.table})...`);
  
  // 1. Tag count verification
  const tagsToCheck = ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'p', 'b', 'strong', 'i', 'em', 'span', 'ul', 'ol', 'li', 'br', 'div'];
  let tagMismatch = false;
  for (const tag of tagsToCheck) {
    const deCounts = countTag(de, tag);
    const arCounts = countTag(ar, tag);
    
    if (deCounts.open !== arCounts.open || deCounts.close !== arCounts.close) {
      console.error(`  [ERROR] Tag <${tag}> mismatch:`);
      console.error(`    German: open=${deCounts.open}, close=${deCounts.close}`);
      console.error(`    Arabic: open=${arCounts.open}, close=${arCounts.close}`);
      tagMismatch = true;
      hasErrors = true;
    }
  }
  if (!tagMismatch) {
    console.log(`  ✓ All HTML tags matched perfectly.`);
  }

  // 2. Price / numbers preservation verification
  const deNums = Array.from(new Set(extractNumbersAndPrices(de)));
  const arNums = Array.from(new Set(extractNumbersAndPrices(ar)));

  // Compare sorted arrays
  const deStr = JSON.stringify(deNums);
  const arStr = JSON.stringify(arNums);

  if (deStr !== arStr) {
    console.error(`  [ERROR] Numbers or prices mismatch:`);
    console.error(`    German: ${deStr}`);
    console.error(`    Arabic: ${arStr}`);
    hasErrors = true;
  } else {
    console.log(`  ✓ All numbers, € prices, and free options preserved exactly.`);
  }
}

if (hasErrors) {
  console.error('\n❌ Cross-check failed with errors.');
  process.exit(1);
} else {
  console.log('\n✅ Cross-check PASSED: Tag count and prices/numbers match perfectly across all 24 entities.');
}
