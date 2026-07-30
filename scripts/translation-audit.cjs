require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// DISTINCTIVELY German words — things that would NEVER appear in a correctly translated
// EN/AR/FR/HU/RU version. Avoids false positives like "guide", "transfer", "hotel", "VIP".
const GERMAN_ONLY = [
  // German nouns (always capitalized) that are NOT loanwords
  /\bTeilnehmer\b/, /\bFahrzeug\b/, /\bfahrzeug\b/,
  /\bPreis\b(?!\s*(pro|per|par|per|personen|Person|человека|fő|personne|شخص|للشخص)\b)/,
  /\bPreis\s+pro\s+Person\b/, /\bPreis\s+pro\s+Personen\b/,
  /\bSchnorchel\b/, /\bschnorchel\b/i,
  /\bAusflug\b/, /\bausflug\b/i,
  /\bLimousine\b(?!.*limo|.*sedan)/i,
  /\bMinibus\b/, /\bSpeedboot\b/, /\bspeedboot\b/i,
  /\bPrivater\b/, /\bPrivates\b/, /\bPrivaten\b/,
  /\bkostenlos\b/, /\bKostenlos\b/,
  /\bFrühstück\b/, /\bFrühstuck\b/, /\bfrühstück\b/i,
  /\bAbendessen\b/, /\bMittagessen\b/,
  /\bEintritt\b/, /\bEintrittskarten\b/,
  /\bTrinkgelder\b/, /\bTrinkgeld\b/,
  /\binbegriffen\b/, /\bnicht\s+inbegriffen\b/,
  /\binklusive\b/i, /\bexklusive\b/i,
  /\bTreffpunkt\b/, /\bDauer\b/,
  /\bSchwierigkeit\b/, /\bMindestalter\b/,
  /\bMaximale\s+Teilnehmer\b/,
  /\bUhr\b(?![a-zA-Z])/,
  /\bStunden\b/, /\bTage\b/, /\bNacht\b/, /\bTag\b/,
  /\bReiseleiter\b/, /\bReiseführer\b/i,
  /\bAbholung\b/, /\bRücktransfer\b/i,
  /\bVerpflegung\b/, /\bUnterkunft\b/,
  /\bBesichtigung\b/, /\bFührung\b/,
  /\bPersonen\b/, /\bincl\.\b/,
  /\bp\.\s*P\.\b/,
  /\bAuf\s+Anfrage\b/, /\bauf\s+Anfrage\b/,
  /\bca\.\s*\d/, /\bca\.\s*Uhr\b/,

  // German HTML artifacts
  /data-label="[^"]*Preis\s*"/,
  /data-label="[^"]*Teilnehmer"/,
  /data-label="[^"]*Fahrzeug"/,
  /data-label="[^"]*Boot"/,

  // German-specific chars in wrong places
  /ß/,
];

const LOCALES = ['en', 'ar', 'fr', 'hu', 'ru'];

const TEXT_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'short_description', label: 'Short Description' },
  { key: 'category_label', label: 'Category Label' },
  { key: 'meeting_point', label: 'Meeting Point' },
  { key: 'duration', label: 'Duration' },
];

const ARRAY_FIELDS = [
  { key: 'highlights', label: 'Highlights' },
  { key: 'included', label: 'Included' },
  { key: 'not_included', label: 'Not Included' },
];

function findGerman(text) {
  if (!text) return [];
  const found = [];
  for (const re of GERMAN_ONLY) {
    const m = text.match(re);
    if (m) {
      const val = m[0].trim();
      if (val && !found.includes(val)) found.push(val);
    }
  }
  return found;
}

function checkFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];
  const issues = [];
  for (const faq of faqs) {
    const q = findGerman(faq.question);
    const a = findGerman(faq.answer);
    if (q.length) issues.push({ field: 'faq.question', matches: q });
    if (a.length) issues.push({ field: 'faq.answer', matches: a });
  }
  return issues;
}

function checkContent(content) {
  if (!content) return [];
  try {
    const items = JSON.parse(content);
    if (Array.isArray(items)) {
      const issues = [];
      for (const item of items) {
        const t = findGerman(item.title);
        const c = findGerman(item.content);
        if (t.length) issues.push({ field: 'itinerary.title', matches: t });
        if (c.length) issues.push({ field: 'itinerary.content', matches: c });
      }
      return issues;
    }
  } catch {}
  return [];
}

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: tours } = await db.from('tours').select('*').eq('active', true);
  const { data: allCt } = await db.from('content_translations')
    .select('*')
    .eq('table_name', 'tours');

  const localeTotals = { en: 0, ar: 0, fr: 0, hu: 0, ru: 0 };
  const localeToursWithIssues = { en: 0, ar: 0, fr: 0, hu: 0, ru: 0 };

  const results = [];

  for (const tour of tours) {
    const tourResult = { slug: tour.slug, name: tour.name, locales: {} };

    for (const loc of LOCALES) {
      const ct = allCt.find(c => c.row_id === tour.id && c.locale === loc);
      if (!ct) {
        tourResult.locales[loc] = { missing: true, issues: [] };
        localeTotals[loc]++;
        localeToursWithIssues[loc]++;
        continue;
      }

      const issues = [];

      // Text fields
      for (const f of TEXT_FIELDS) {
        const g = findGerman(ct[f.key]);
        if (g.length) {
          const val = ct[f.key] || '';
          issues.push({
            type: 'text',
            field: f.key,
            snippet: val.length > 100 ? val.substring(0, 100) + '...' : val,
            matches: g,
          });
        }
      }

      // Array fields
      for (const f of ARRAY_FIELDS) {
        const arr = ct[f.key] || [];
        for (let i = 0; i < arr.length; i++) {
          const g = findGerman(arr[i]);
          if (g.length) {
            issues.push({
              type: 'array',
              field: f.key,
              index: i,
              snippet: arr[i].length > 100 ? arr[i].substring(0, 100) + '...' : arr[i],
              matches: g,
            });
          }
        }
      }

      // FAQs
      for (const faqIssue of checkFaqs(ct.faqs)) {
        issues.push({ type: 'faq', ...faqIssue });
      }

      // Content/itinerary
      for (const ci of checkContent(ct.content)) {
        issues.push({ type: 'content', ...ci });
      }

      if (issues.length > 0) {
        localeTotals[loc] += issues.length;
        localeToursWithIssues[loc]++;
        tourResult.locales[loc] = { missing: false, issues };
      } else {
        tourResult.locales[loc] = { missing: false, issues: [] };
      }
    }

    results.push(tourResult);
  }

  // Build report
  let out = '';
  const SEP = '='.repeat(100) + '\n';
  const SEP2 = '-'.repeat(100) + '\n';

  out += SEP;
  out += 'TRANSLATION AUDIT — German Leftovers in Non-German Locales\n';
  out += `Generated: ${new Date().toISOString()}\n`;
  out += `Note: Only flags distinctively German words that clearly should have been translated.\n`;
  out += `Common loanwords (guide, transfer, hotel, VIP, etc.) are NOT flagged.\n\n`;

  // Summary table
  out += SEP2;
  out += 'SUMMARY\n'.padStart(50);
  out += SEP2;
  out += `${'Locale'.padEnd(10)} ${'Issues'.padEnd(10)} ${'Tours affected'.padEnd(15)}\n`;
  out += SEP2;
  for (const loc of LOCALES) {
    out += `${loc.padEnd(10)} ${String(localeTotals[loc]).padEnd(10)} ${String(localeToursWithIssues[loc]).padEnd(15)}\n`;
  }
  const totalIssues = Object.values(localeTotals).reduce((a, b) => a + b, 0);
  out += `${SEP2}\nTotal issues: ${totalIssues}\n\n`;

  // Per-tour detail
  out += SEP2;
  out += 'DETAILED PER-TOUR BREAKDOWN\n';
  out += SEP2;

  for (const r of results) {
    const hasAny = Object.values(r.locales).some(l => l.issues.length > 0 || l.missing);
    if (!hasAny) continue;

    out += `\n${'='.repeat(80)}\n`;
    out += `TOUR: ${r.name}\n`;
    out += `Slug: ${r.slug}\n`;
    out += `${'='.repeat(80)}\n`;

    for (const [loc, data] of Object.entries(r.locales)) {
      if (data.missing) {
        out += `\n  [${loc.toUpperCase()}] ⚠ MISSING — no translation row exists\n`;
        continue;
      }
      if (!data.issues.length) continue;

      out += `\n  [${loc.toUpperCase()}] ${data.issues.length} issue(s):\n`;

      for (const iss of data.issues) {
        const matches = [...new Set(iss.matches)].join(', ');
        if (iss.type === 'text') {
          out += `    📝 ${iss.field}: "${iss.snippet}"\n`;
          out += `       → German: ${matches}\n`;
        } else if (iss.type === 'array') {
          out += `    📋 ${iss.field}[${iss.index}]: "${iss.snippet}"\n`;
          out += `       → German: ${matches}\n`;
        } else if (iss.type === 'faq') {
          out += `    ❓ ${iss.field}: → German: ${matches}\n`;
        } else if (iss.type === 'content') {
          out += `    📅 ${iss.field}: → German: ${matches}\n`;
        }
      }
    }
  }

  // Clean tours
  const clean = results.filter(r =>
    Object.values(r.locales).every(l => l.issues.length === 0 && !l.missing)
  );
  out += `\n\n${'='.repeat(80)}\n`;
  out += `FULLY TRANSLATED TOURS (no German leftovers, all locales present): ${clean.length}/${tours.length}\n`;
  for (const r of clean) {
    out += `  ✅ ${r.name}\n`;
  }

  const outPath = path.join(__dirname, '..', 'public', 'translation-audit-report.txt');
  fs.writeFileSync(outPath, out);
  console.log(`Report written to: public/translation-audit-report.txt\n`);

  // Short console summary
  for (const loc of LOCALES) {
    const pct = Math.round((1 - localeToursWithIssues[loc] / tours.length) * 100);
    console.log(`${loc.toUpperCase()}: ${localeTotals[loc]} German leftovers across ${localeToursWithIssues[loc]}/${tours.length} tours`);
  }
  console.log(`\nFully clean tours: ${clean.length}/${tours.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
