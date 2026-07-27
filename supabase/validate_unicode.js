require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Check for non-Arabic, non-allowed characters in Arabic text
function findIllegalChars(text) {
  if (!text || typeof text !== 'string') return [];
  const issues = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.codePointAt(i);
    const ch = text[i];
    
    // Skip surrogate pairs (already handled by codePointAt)
    if (code > 0xFFFF) { i++; continue; }
    
    // Allow: ASCII printable (32-126) — covers Latin, digits, common punctuation, €, etc.
    if (code >= 32 && code <= 126) continue;
    
    // Allow: Arabic block (0600-06FF)
    if (code >= 0x0600 && code <= 0x06FF) continue;
    
    // Allow: Arabic Supplement (0750-077F)
    if (code >= 0x0750 && code <= 0x077F) continue;
    
    // Allow: Arabic Extended-A (08A0-08FF)
    if (code >= 0x08A0 && code <= 0x08FF) continue;
    
    // Allow: Arabic Presentation Forms-A (FB50-FDFF)
    if (code >= 0xFB50 && code <= 0xFDFF) continue;
    
    // Allow: Arabic Presentation Forms-B (FE70-FEFF)
    if (code >= 0xFE70 && code <= 0xFEFF) continue;
    
    // Allow: Common punctuation/diacritics
    // Tab, newline, carriage return
    if (code === 9 || code === 10 || code === 13) continue;
    
    // Allow: euro sign
    if (code === 0x20AC) continue;
    
    // Allow: multiplication/division signs
    if (code === 0x00D7 || code === 0x00F7) continue;
    
    // Allow: various dashes, quotes
    if (code === 0x2010 || code === 0x2011 || code === 0x2012 || code === 0x2013 || code === 0x2014 || code === 0x2015) continue; // dashes
    if (code === 0x2018 || code === 0x2019 || code === 0x201C || code === 0x201D) continue; // curly quotes
    if (code === 0x2026) continue; // ellipsis …
    if (code === 0x00A0) continue; // nbsp

    // Allow: specific decorative emoji (explicit allowlist — not a broad emoji range)
    // These 9 codepoints appear in human-reviewed Arabic tour descriptions as bullet/checkmark decorators
    if (code === 0x2728) continue; // ✨ SPARKLES
    if (code === 0x2714) continue; // ✔ HEAVY CHECK MARK
    if (code === 0x2713) continue; // ✓ CHECK MARK
    if (code === 0x2B50) continue; // ⭐ STAR
    if (code === 0x1F37D) continue; // 🍽️ FORK AND KNIFE WITH PLATE (codepoint 0x1F37D + VS16)
    if (code === 0x267F) continue; // ♿ WHEELCHAIR SYMBOL
    if (code === 0x1F39F) continue; // 🎟️ ADMISSION TICKETS (codepoint 0x1F39F + VS16)
    if (code === 0x1F468 || code === 0x1F469 || code === 0x1F467) continue; // 👨 👩 👧 FAMILY emoji components (ZWJ sequences)
    if (code === 0x200D) continue; // ZERO WIDTH JOINER (used in family emoji ZWJ sequences)
    if (code === 0x23F0) continue; // ⏰ ALARM CLOCK
    if (code === 0xFE0F) continue; // VARIATION SELECTOR-16 (VS16, emoji presentation)
    
    // Allow: combining marks (diacritics/tashkeel)
    if (code >= 0x0610 && code <= 0x061A) continue; // Arabic marking
    if (code >= 0x064B && code <= 0x065F) continue; // Arabic diacritical marks
    if (code >= 0x0670) continue; // superscript alef
    if (code >= 0x06D6 && code <= 0x06DC) continue; // Arabic high sign
    if (code >= 0x06DF && code <= 0x06E4) continue;
    if (code >= 0x06E7 && code <= 0x06E8) continue;
    if (code >= 0x06EA && code <= 0x06ED) continue;
    
    // Flag any other character
    const hex = '0x' + code.toString(16).toUpperCase().padStart(4, '0');
    issues.push({ char: ch, code: hex, pos: i });
  }
  return issues;
}

(async () => {
  const { data: arRows } = await supabase.from('content_translations')
    .select('*')
    .eq('locale', 'ar');

  const stringFields = ['name', 'description', 'short_description', 'category_label', 'meeting_point', 'duration', 'title', 'excerpt', 'content', 'read_time'];
  const arrayFields = ['highlights', 'included', 'not_included', 'faqs'];

  let totalFields = 0;
  let totalIssues = 0;
  const allIssues = [];

  for (const row of arRows) {
    const { table_name, row_id } = row;
    
    for (const field of stringFields) {
      totalFields++;
      const val = row[field];
      if (!val || val.length === 0) continue;
      const issues = findIllegalChars(val);
      if (issues.length > 0) {
        totalIssues += issues.length;
        allIssues.push({ table: table_name, row_id, field, issues });
      }
    }

    for (const field of arrayFields) {
      const val = row[field];
      if (!val || !Array.isArray(val)) continue;
      for (let i = 0; i < val.length; i++) {
        totalFields++;
        const item = val[i];
        if (typeof item !== 'string') {
          // Handle FAQ objects
          if (typeof item === 'object') {
            for (const [k, v] of Object.entries(item)) {
              totalFields++;
              if (typeof v === 'string') {
                const issues = findIllegalChars(v);
                if (issues.length > 0) {
                  totalIssues += issues.length;
                  allIssues.push({ table: table_name, row_id, field: field + '[' + i + '].' + k, issues });
                }
              }
            }
          }
          continue;
        }
        const issues = findIllegalChars(item);
        if (issues.length > 0) {
          totalIssues += issues.length;
          allIssues.push({ table: table_name, row_id, field: field + '[' + i + ']', issues });
        }
      }
    }
  }

  console.log('=== UNICODE VALIDATION REPORT ===');
  console.log('Total fields scanned: ' + totalFields);
  console.log('Total illegal characters found: ' + totalIssues);
  console.log('Fields with issues: ' + allIssues.length);
  console.log('');

  if (allIssues.length > 0) {
    for (const issue of allIssues) {
      console.log('[' + issue.table + '] ' + issue.row_id);
      console.log('  Field: ' + issue.field);
      for (const ch of issue.issues) {
        const name = getCharName(ch.code);
        console.log('  ILLEGAL: ' + ch.char + ' (' + ch.code + ') at pos ' + ch.pos + ' — ' + name);
      }
      console.log('');
    }
  } else {
    console.log('ALL FIELDS PASS — no non-Arabic script characters found.');
  }
})();

function getCharName(hex) {
  const code = parseInt(hex, 16);
  if (code >= 0x4E00 && code <= 0x9FFF) return 'CJK UNIFIED IDEOGRAPH';
  if (code >= 0x3400 && code <= 0x4DBF) return 'CJK UNIFIED IDEOGRAPH EXT-A';
  if (code >= 0x0041 && code <= 0x005A) return 'LATIN CAPITAL LETTER';
  if (code >= 0x0061 && code <= 0x007A) return 'LATIN SMALL LETTER';
  if (code >= 0x0400 && code <= 0x04FF) return 'CYRILLIC';
  if (code >= 0x0370 && code <= 0x03FF) return 'GREEK';
  if (code >= 0x3000 && code <= 0x303F) return 'CJK SYMBOLS AND PUNCTUATION';
  if (code >= 0xFF00 && code <= 0xFFEF) return 'HALFWIDTH AND FULLWIDTH FORMS';
  if (code >= 0x3040 && code <= 0x309F) return 'HIRAGANA';
  if (code >= 0x30A0 && code <= 0x30FF) return 'KATAKANA';
  return 'UNKNOWN SCRIPT';
}
