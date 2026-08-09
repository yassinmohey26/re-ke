require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALE = process.argv[2];
if (!['fr', 'hu'].includes(LOCALE)) { console.error('usage: node _scratch-refined-audit.cjs <fr|hu>'); process.exit(1); }

// BASE word list (unchanged) minus the false positive for this locale
const BASE = [
  'und','der','die','das','dem','den','des','von','mit','im','am','zu','auf','ist','sind',
  'für','fuer','aus','bei','nach','über','uber','eine','einem','einer','einen','nicht','auch',
  'als','wie','sie','wir','ihr','zur','vom','zum','aber','dann','dort','hier','sehr','viel',
  'noch','schon','immer','geniessen','genießen','zurück','zurueck','fahren','sehen','besuchen',
  'einige','wichtigsten','entspannten','erwarten','schlendern','Grosse','Große','Aussenstelle',
  'Außenstelle','Ihr','Sie','Die','Der','Von','Ein','Einer','Nach','Ihres','Ihnen','ihrer',
  'ihrem','ihren','sein','sich','ohne','kein','keine','Ihre','ein','Stunde','Stunden','Tag',
  'Tage','Abend','Abends','Morgen','Nacht','Uhr','Hotelabholung','Bootsfahrt','Schnorcheln',
  'Rückfahrt','Rueckfahrt','Ankunft','Abholung','Besuch','Fahrt','Tour','Insel','Bord','Hotel',
  'privat','Privaten','Speedboot','Sandstrand','Sonnen','Riffen','Riffe','Meeres','Korallen',
  'erleben','Hafen','Start','Beginn','Ende','durch','gegen','bis','ca','zzgl','inkl','max',
];
const EXCLUDE = LOCALE === 'fr' ? new Set(['des']) : new Set(['mit']);
const DE_WORDS = new Set(BASE.filter(w => !EXCLUDE.has(w)));

function germanWords(text) {
  return String(text || '').split(/[^A-Za-z\u00C0-\u017F\-']+/)
    .filter(w => w.length > 0 && DE_WORDS.has(w));
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

  let flagged = 0;
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
      if (deItin && deItin.length > 0) { flagged++; console.log(`MISSING: ${t.slug} (id=${row?.id})`); }
      continue;
    }
    let broken = 0;
    const hits = [];
    itin.forEach((step, i) => {
      const tw = germanWords(step.title); const cw = germanWords(step.content);
      if (tw.length + cw.length > 0) { broken++; hits.push(`${i}:${[...tw, ...cw].join(',')}`); }
    });
    if (broken > 0 || (deItin && itin.length !== deItin.length)) {
      flagged++;
      console.log(`BROKEN: ${t.slug} (id=${row?.id}) broken=${broken} stepCountMismatch=${deItin && itin.length !== deItin.length} [${hits.join(' | ')}]`);
    } else {
      console.log(`CLEAN: ${t.slug}`);
    }
  }
  console.log(`\nTotal flagged with refined list (${LOCALE}): ${flagged}`);
})();
