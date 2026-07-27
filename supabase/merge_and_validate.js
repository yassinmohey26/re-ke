const fs = require('fs');
const path = require('path');

const arTranslationsPath = path.join(__dirname, 'ar_translations.json');
const arDescPath = path.join(__dirname, 'ar_descriptions_translated.json');

// Read files
const arTranslations = JSON.parse(fs.readFileSync(arTranslationsPath, 'utf8'));
const arDescriptions = JSON.parse(fs.readFileSync(arDescPath, 'utf8'));

console.log(`Loaded ${arTranslations.length} entities from ar_translations.json`);
console.log(`Loaded ${arDescriptions.length} translated descriptions`);

// Merge descriptions
let updatedCount = 0;
for (const entry of arTranslations) {
  const descMatch = arDescriptions.find(d => d.id === entry.r);
  if (descMatch) {
    entry.d = descMatch.ar_description;
    updatedCount++;
  }
}

console.log(`Updated ${updatedCount} entities with the 'd' (description) field.`);

// Write the updated ar_translations.json back
fs.writeFileSync(arTranslationsPath, JSON.stringify(arTranslations, null, 2), 'utf8');
console.log(`Saved updated ar_translations.json`);

// Mechanical Unicode Validation
function findIllegalChars(text) {
  if (!text || typeof text !== 'string') return [];
  const issues = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.codePointAt(i);
    const ch = text[i];
    
    if (code > 0xFFFF) { i++; continue; }
    
    // Allow ASCII printable (32-126)
    if (code >= 32 && code <= 126) continue;
    
    // Allow Arabic blocks
    if (code >= 0x0600 && code <= 0x06FF) continue;
    if (code >= 0x0750 && code <= 0x077F) continue;
    if (code >= 0x08A0 && code <= 0x08FF) continue;
    if (code >= 0xFB50 && code <= 0xFDFF) continue;
    if (code >= 0xFE70 && code <= 0xFEFF) continue;
    
    // Tab, newline, carriage return
    if (code === 9 || code === 10 || code === 13) continue;
    
    // Euro sign
    if (code === 0x20AC) continue;
    
    // Multiplication/division signs
    if (code === 0x00D7 || code === 0x00F7) continue;
    
    // Dashes, quotes, ellipsis, nbsp
    if (code === 0x2010 || code === 0x2011 || code === 0x2012 || code === 0x2013 || code === 0x2014 || code === 0x2015) continue;
    if (code === 0x2018 || code === 0x2019 || code === 0x201C || code === 0x201D) continue;
    if (code === 0x2026) continue;
    if (code === 0x00A0) continue;
    
    // Combining marks / diacritics
    if (code >= 0x0610 && code <= 0x061A) continue;
    if (code >= 0x064B && code <= 0x065F) continue;
    if (code >= 0x0670) continue;
    if (code >= 0x06D6 && code <= 0x06DC) continue;
    if (code >= 0x06DF && code <= 0x06E4) continue;
    if (code >= 0x06E7 && code <= 0x06E8) continue;
    if (code >= 0x06EA && code <= 0x06ED) continue;
    
    const hex = '0x' + code.toString(16).toUpperCase().padStart(4, '0');
    issues.push({ char: ch, code: hex, pos: i });
  }
  return issues;
}

let totalIssues = 0;
for (const entry of arTranslations) {
  // We only scan fields of entities that we updated to see if the new descriptions have any illegal characters.
  const descMatch = arDescriptions.find(d => d.id === entry.r);
  if (descMatch) {
    const issues = findIllegalChars(entry.d);
    if (issues.length > 0) {
      totalIssues += issues.length;
      console.log(`Entity ${entry.r} (${entry.n || 'No Name'}) has ${issues.length} issues in description:`);
      for (const issue of issues) {
        console.log(`  Illegal character: '${issue.char}' (${issue.code}) at position ${issue.pos}`);
      }
    }
  }
}

console.log(`\n=== Unicode Scan Complete ===`);
console.log(`Total illegal characters found: ${totalIssues}`);
