/* READ-ONLY — audit itineraries for a locale for embedded German / missing itin. Usage: node scripts/itin_audit_locale.cjs <fr|hu> */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALE = process.argv[2];
if (!['fr', 'hu', 'ru'].includes(LOCALE)) { console.error('Usage: node scripts/itin_audit_locale.cjs <fr|hu|ru>'); process.exit(1); }

// Words that collide with the German list but are native to the target locale.
// ('mit' is native Hungarian; 'des'/'Tour' are native French.)
const NATIVE_WORDS = { 'fr': new Set(['des', 'Tour']), 'hu': new Set(['mit']), 'ru': new Set() };

const DE_WORDS = new Set([
  'und','der','die','das','dem','den','des','von','mit','im','am','zu','auf','ist','sind',
  'f\u00fcr','fuer','aus','bei','nach','\u00fcber','uber','eine','einem','einer','einen','nicht','auch',
  'als','wie','sie','wir','ihr','zur','vom','zum','aber','dann','dort','hier','sehr','viel',
  'noch','schon','immer','geniessen','genie\u00dfen','zur\u00fcck','zurueck','fahren','sehen','besuchen',
  'einige','wichtigsten','entspannten','erwarten','schlendern','Grosse','Gro\u00dfe','Aussenstelle',
  'Au\u00dfenstelle','Ihr','Sie','Die','Der','Von','Ein','Einer','Nach','Ihres','Ihnen','ihrer',
  'ihrem','ihren','sein','sich','ohne','kein','keine','Ihre','ein','Stunde','Stunden','Tag',
  'Tage','Abend','Abends','Morgen','Nacht','Uhr','Hotelabholung','Bootsfahrt','Schnorcheln',
  'R\u00fcckfahrt','Rueckfahrt','Ankunft','Abholung','Besuch','Fahrt','Tour','Insel','Bord','Hotel',
  'privat','Privaten','Speedboot','Sandstrand','Sonnen','Riffen','Riffe','Meeres','Korallen',
  'erleben','Hafen','Start','Beginn','Ende','durch','gegen','bis','ca','zzgl','inkl','max',
]);

function isNative(text) { return /[\u0400-\u04FF\u00C0-\u024F\u00C0-\u017F]/.test(text || ''); }
function germanWords(text) {
  return String(text || '').split(/[^A-Za-z\u00C0-\u017F\-']+/)
    .filter(w => w.length > 0 && DE_WORDS.has(w) && !(NATIVE_WORDS[LOCALE] || new Set()).has(w));
}
function parseItin(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const p = JSON.parse(val); if (Array.isArray(p)) return p; } catch {} }
  return null;
}

(async () => {
  const { data: tours } = await db.from('tours')
    .select('id, slug, itinerary')
    .eq('active', true)
    .order('slug', { ascending: true });

  const flagged = [];
  for (const t of tours || []) {
    const deItin = parseItin(t.itinerary);
    const { data: rows } = await db.from('content_translations')
      .select('id, itinerary, content')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .eq('locale', LOCALE);
    const row = rows?.[0];
    const itin = row ? (parseItin(row.itinerary) ?? parseItin(row.content)) : null;

    if (!itin) {
      if (deItin && deItin.length > 0) {
        flagged.push({ slug: t.slug, id: row?.id, kind: 'MISSING-' + LOCALE.toUpperCase(), deSteps: deItin.length, locSteps: 0 });
      }
      continue;
    }

    let broken = 0;
    let nativeOnly = 0;
    itin.forEach((step, i) => {
      const tw = germanWords(step.title); const cw = germanWords(step.content);
      const tN = isNative(step.title); const cN = isNative(step.content);
      if (tw.length + cw.length > 0) broken++;
      if (!tN && !cN) nativeOnly++;
    });
    if (broken > 0 || (deItin && itin.length !== deItin.length)) {
      flagged.push({
        slug: t.slug, id: row?.id, kind: 'BROKEN', deSteps: deItin?.length ?? 0, locSteps: itin.length,
        broken, nativeOnly, stepCountMismatch: deItin && itin.length !== deItin.length,
      });
    } else {
      console.log(`CLEAN: ${t.slug} (loc steps=${itin.length}, de steps=${deItin?.length ?? 0})`);
    }
  }

  console.log(`\n===== ${LOCALE.toUpperCase()} FLAGGED =====`);
  for (const f of flagged) {
    console.log(`${f.kind}${f.stepCountMismatch ? ' (STEP-COUNT MISMATCH)' : ''} | ${f.slug} | id=${f.id} | de=${f.deSteps} loc=${f.locSteps}${f.broken ? ' broken=' + f.broken + ' nativeOnly=' + f.nativeOnly : ''}`);
  }
  console.log(`\nTotal flagged: ${flagged.length}`);
})();
