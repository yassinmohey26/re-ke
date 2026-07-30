require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient} = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALES = ['en','ru','fr','hu','ar'];
const LOCALE_LABELS = {en:'English',ru:'Russian',fr:'French',hu:'Hungarian',ar:'Arabic'};

// Patterns that indicate a duration value is actually a time-of-day or location (i.e. WRONG)
const TIME_PATTERN = /\b(\d{1,2}:\d{2})\s*(Uhr|AM|PM|a\.m|p\.m|am|pm)\b/i;
const LOCATION_KEYWORDS = ['Red Sea','Rotes Meer','Красное море','Vörös-tenger','Mer Rouge','Hotel pickup'];

// Extract the numeric/pure time value from a duration string for comparison
function extractDurationNum(s) {
  if (!s) return null;
  const m = s.match(/(\d+)\s*(Tag|day|jour|jour|День|nap|giorno|día)?/i);
  if (m) return parseInt(m[1]);
  return null;
}

// Detect if a duration string contains a time-of-day (shouldn't, that's meeting_point)
function isDurationActuallyTime(s) {
  if (!s) return false;
  return TIME_PATTERN.test(s);
}

// Detect if a meeting_point value is actually a location (hotel/area name) instead of a pickup time
function isMeetingPointLocationNotTime(s) {
  if (!s) return false;
  // If it contains a time-like pattern, it's fine (it's a pickup time)
  if (TIME_PATTERN.test(s)) return false;
  // If it mentions pickup, hotel, etc., it's a location description not a time
  if (LOCATION_KEYWORDS.some(k => s.includes(k))) return true;
  // If it's an empty string
  if (s.trim() === '') return true;
  return false;
}

(async()=>{
  // Fetch ALL tours with base DE content
  const {data: tours} = await db.from('tours').select('*');
  console.log(`Found ${tours.length} tours\n`);

  // Fetch ALL content_translations for tours
  const {data: allTrs} = await db.from('content_translations')
    .select('*')
    .eq('table_name', 'tours');
  
  // Index translations by (row_id, locale)
  const trMap = {};
  for (const tr of allTrs || []) {
    if (!trMap[tr.row_id]) trMap[tr.row_id] = {};
    trMap[tr.row_id][tr.locale] = tr;
  }

  let totalIssuesFound = 0;
  const allReports = [];

  for (const tour of tours) {
    const slug = tour.slug;
    let tourIssues = [];
    const deContent = {};

    // Check duration
    for (const loc of LOCALES) {
      const tr = trMap[tour.id]?.[loc];
      if (!tr) {
        tourIssues.push({locale:loc, field:'duration', issue:'MISSING_ROW', deVal:tour.duration, localeVal:'(none)'});
        continue;
      }

      // Duration check
      if (tr.duration !== null) {
        // Check if duration actually contains a time-of-day (shouldn't)
        if (isDurationActuallyTime(tr.duration)) {
          tourIssues.push({locale:loc, field:'duration', issue:'WRONG_VALUE_IS_TIME', deVal:tour.duration, localeVal:tr.duration});
        }
      }

      // Meeting_point check
      if (isMeetingPointLocationNotTime(tr.meeting_point)) {
        // But only flag if the DE one IS a time (meaning the locale should also be a time)
        if (tour.meeting_point && TIME_PATTERN.test(tour.meeting_point)) {
          tourIssues.push({locale:loc, field:'meeting_point', issue:'WRONG_VALUE_IS_LOCATION', deVal:tour.meeting_point, localeVal:tr.meeting_point});
        }
      }
      // Also check if meeting_point is empty while DE has a value
      if ((!tr.meeting_point || tr.meeting_point.trim() === '') && tour.meeting_point && tour.meeting_point.trim() !== '') {
        tourIssues.push({locale:loc, field:'meeting_point', issue:'EMPTY', deVal:tour.meeting_point, localeVal:tr.meeting_point || '(empty)'});
      }
      // Meeting_point has time while DE has time, but different time values (could be OK for same-day tours with different seasons)
      // Flag only if the time difference is > 1 hour (suspicious)
      if (tr.meeting_point && tour.meeting_point) {
        const trTime = tr.meeting_point.match(/(\d{1,2}):(\d{2})/);
        const deTime = tour.meeting_point.match(/(\d{1,2}):(\d{2})/);
        if (trTime && deTime && trTime[1] !== deTime[1]) {
          const diff = Math.abs(parseInt(trTime[1]) - parseInt(deTime[1]));
          if (diff > 1) {
            // This is suspicious — pickup times shouldn't differ by >1 hour
            tourIssues.push({locale:loc, field:'meeting_point', issue:'TIME_MISMATCH', deVal:tour.meeting_point, localeVal:tr.meeting_point});
          }
        }
      }
    }

    // Check itinerary (content field in translations)
    // Parse base itinerary
    let baseItin = [];
    if (typeof tour.itinerary === 'string') {
      try { baseItin = JSON.parse(tour.itinerary); } catch(e) {}
    } else if (Array.isArray(tour.itinerary)) {
      baseItin = tour.itinerary;
    }

    for (const loc of LOCALES) {
      const tr = trMap[tour.id]?.[loc];
      if (!tr) continue;

      // content field should contain itinerary JSON
      let locItin = [];
      if (tr.content) {
        try { locItin = JSON.parse(tr.content); } catch(e) {
          tourIssues.push({locale:loc, field:'itinerary', issue:'PARSE_FAIL', deVal:`${baseItin.length} steps`, localeVal:'(parse error)'});
        }
      }

      if (baseItin.length > 0 && locItin.length > 0 && baseItin.length !== locItin.length) {
        tourIssues.push({locale:loc, field:'itinerary', issue:`STEP_COUNT_MISMATCH (DE=${baseItin.length}, ${loc}=${locItin.length})`, deVal:`${baseItin.length} steps`, localeVal:`${locItin.length} steps`});
      }

      // Check for German text in non-DE content
      if (tr.content && loc !== 'de') {
        // Check if any German-specific words appear (not common with other languages)
        const germanMarkers = /(\bAbholung\b|\bAnkunft\b|\bBesuch\b|\bFahrt\b|\bMittagessen\b|\bRückfahrt\b|\bRücktransfer\b|\bFrühstück\b|\bAbendessen\b)/i;
        if (germanMarkers.test(tr.content)) {
          tourIssues.push({locale:loc, field:'itinerary', issue:'GERMAN_TEXT_IN_CONTENT', deVal:'(should be translated)', localeVal:'(contains German words in itinerary)'});
        }
      }

      // Check FAQs
      const baseFaqs = Array.isArray(tour.faqs) ? tour.faqs : [];
      const locFaqs = Array.isArray(tr.faqs) ? tr.faqs : [];
      if (baseFaqs.length > 0 && locFaqs.length > 0 && baseFaqs.length !== locFaqs.length) {
        tourIssues.push({locale:loc, field:'faqs', issue:`FAQ_COUNT_MISMATCH (DE=${baseFaqs.length}, ${loc}=${locFaqs.length})`, deVal:`${baseFaqs.length} FAQs`, localeVal:`${locFaqs.length} FAQs`});
      }

      // Check for German text in FAQs
      if (tr.faqs && loc !== 'de') {
        const faqStr = JSON.stringify(tr.faqs);
        const germanMarkers = /(\bAbholung\b|\bAnkunft\b|\bBesuch\b|\bFahrt\b|\bMittagessen\b|\bRückfahrt\b|\bFrühstück\b|\bbitte\b|\boder\b|\bund\b|\bist\b|\bein\b|\bder\b|\bdie\b|\bdas\b)/i;
        const matches = faqStr.match(germanMarkers);
        if (matches) {
          // Only flag if there are many German words (more than 2)
          const uniqueMatches = new Set(matches.map(m=>m.toLowerCase()));
          if (uniqueMatches.size > 2) {
            tourIssues.push({locale:loc, field:'faqs', issue:'GERMAN_TEXT_IN_FAQS', deVal:'(should be translated)', localeVal:`(found German: ${[...uniqueMatches].slice(0,5).join(', ')})`});
          }
        }
      }
    }

    // Check highlights/included/not_included counts
    for (const loc of LOCALES) {
      const tr = trMap[tour.id]?.[loc];
      if (!tr) continue;

      for (const listField of ['highlights', 'included', 'not_included']) {
        const baseArr = Array.isArray(tour[listField]) ? tour[listField] : [];
        const locArr = Array.isArray(tr[listField]) ? tr[listField] : [];
        if (baseArr.length > 0 && locArr.length > 0 && baseArr.length !== locArr.length) {
          tourIssues.push({locale:loc, field:listField, issue:`COUNT_MISMATCH (DE=${baseArr.length}, ${loc}=${locArr.length})`, deVal:`${baseArr.length} items`, localeVal:`${locArr.length} items`});
        }
      }
    }

    // Description check: flag if description contains German section headers in non-DE locale
    for (const loc of LOCALES) {
      const tr = trMap[tour.id]?.[loc];
      if (!tr) continue;
      if (tr.description && loc !== 'de') {
        // Check for German table headers in pricing table
        const deTableHeaders = /(Teilnehmer|Fahrzeug|Preis pro Person|Teilnehmeranzahl)/i;
        if (deTableHeaders.test(tr.description)) {
          tourIssues.push({locale:loc, field:'description', issue:'GERMAN_TABLE_HEADERS', deVal:'(translated headers)', localeVal:'(German table headers found)'});
        }
      }
    }

    if (tourIssues.length > 0) {
      totalIssuesFound += tourIssues.length;
      allReports.push({slug, issues: tourIssues});
    }
  }

  // Print report
  console.log('=== CONTENT PARITY AUDIT REPORT ===\n');
  for (const report of allReports) {
    console.log(`\n### ${report.slug}`);
    for (const iss of report.issues) {
      console.log(`  [${iss.locale}] ${iss.field}: ${iss.issue}`);
      console.log(`    DE:     ${iss.deVal}`);
      console.log(`    ${iss.locale}: ${iss.localeVal}`);
    }
  }

  console.log(`\n\nTotal tours with issues: ${allReports.length}`);
  console.log(`Total issues found: ${totalIssuesFound}`);

  // Save to file for reference
  require('fs').writeFileSync('audit-report.json', JSON.stringify(allReports, null, 2));
  console.log('\nSaved to audit-report.json');
})();
