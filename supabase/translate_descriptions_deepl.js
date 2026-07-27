/**
 * translate_descriptions_deepl.js
 * Uses DeepL API to translate the German HTML descriptions in de_descriptions.json to Arabic.
 * Rules:
 *  - HTML tags/classes/attributes → preserved exactly (DeepL handles this with tag_handling=html)
 *  - Numbers, €, %, digits → preserved by DeepL
 *  - Only visible German text → translated to Arabic
 *  - No non-Arabic characters in output (except HTML syntax, digits, €, whitespace)
 *
 * Uses the project's DEEPL_API_KEY from .env.local
 */

'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const fs   = require('fs');
const path = require('path');
const https = require('https');

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_API_KEY) {
  console.error('ERROR: DEEPL_API_KEY not found in .env.local');
  process.exit(1);
}

// DeepL free API endpoint (uses :fx suffix keys)
const DEEPL_HOST = 'api-free.deepl.com';
// DeepL pro endpoint would be 'api.deepl.com'

/**
 * Translate a single HTML string via DeepL.
 * Uses tag_handling=html so HTML tags/attributes are preserved verbatim.
 */
function translateWithDeepL(htmlText) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      text:           htmlText,
      source_lang:    'DE',
      target_lang:    'AR',
      tag_handling:   'html',
      // Preserve certain placeholders:
      non_splitting_tags: 'td,th,p',
    });

    const body = params.toString();

    const options = {
      hostname: DEEPL_HOST,
      port:     443,
      path:     '/v2/translate',
      method:   'POST',
      headers: {
        'Authorization':  `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type':   'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.translations && json.translations[0]) {
            resolve(json.translations[0].text);
          } else if (json.message) {
            reject(new Error(`DeepL error: ${json.message} (status ${res.statusCode})`));
          } else {
            reject(new Error(`DeepL unexpected response: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse DeepL response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Sleep for ms milliseconds (rate limiting).
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  const inputFile  = path.join(__dirname, 'de_descriptions.json');
  const outputFile = path.join(__dirname, 'ar_descriptions_translated.json');

  const entries = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const results = [];
  let charCount = 0;

  console.log(`Translating ${entries.length} descriptions via DeepL API...`);
  console.log(`DeepL key suffix: ...${DEEPL_API_KEY.slice(-6)}`);
  console.log('');

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const de = entry.de_description;
    charCount += de.length;

    process.stdout.write(`[${i+1}/${entries.length}] ${entry.shortId} (${de.length} chars)... `);

    try {
      const ar = await translateWithDeepL(de);
      results.push({
        id:             entry.id,
        shortId:        entry.shortId,
        table:          entry.table,
        ar_description: ar,
        de_description: de,  // keep for reference
      });
      console.log(`✓ (${ar.length} chars)`);
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
      results.push({
        id:             entry.id,
        shortId:        entry.shortId,
        table:          entry.table,
        ar_description: null,
        error:          err.message,
        de_description: de,
      });
    }

    // Rate limiting: 0.5s between requests to stay within DeepL limits
    if (i < entries.length - 1) {
      await sleep(500);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nDone. Translated ${results.filter(r => r.ar_description).length}/${entries.length} descriptions.`);
  console.log(`Total characters submitted to DeepL: ${charCount}`);
  console.log(`Output: ${outputFile}`);

  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    errors.forEach(e => console.log(`  - ${e.shortId}: ${e.error}`));
  }

  // Show 3 samples
  console.log('\n=== SAMPLE 1 (Private tour – Luxor, full pricing table) ===');
  const s1 = results.find(r => r.shortId === '42a2941f');
  if (s1 && s1.ar_description) console.log(s1.ar_description);

  console.log('\n=== SAMPLE 2 (Group tour – Glass-bottom boat) ===');
  const s2 = results.find(r => r.shortId === '0009b90b');
  if (s2 && s2.ar_description) console.log(s2.ar_description);

  console.log('\n=== SAMPLE 3 (Speedboat dolphin – different column headers) ===');
  const s3 = results.find(r => r.shortId === '27ae0b35');
  if (s3 && s3.ar_description) console.log(s3.ar_description);
})();
