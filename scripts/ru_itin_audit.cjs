/* DRY-RUN READ-ONLY — RU itinerary audit. SELECT only, no writes. */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const DE_WORDS = new Set([
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
]);

function isCyr(text) {
  return /[А-Яа-яЁё]/.test(text || '');
}

function germanWords(text) {
  const t = String(text || '');
  return t.split(/[^A-Za-zÄÖÜäöüß\-']+/)
    .filter(w => w.length > 0)
    .filter(w => DE_WORDS.has(w));
}

function classifyStep(step) {
  const title = step.title || '';
  const content = step.content || '';
  const tWords = germanWords(title);
  const cWords = germanWords(content);
  const tCyr = isCyr(title);
  const cCyr = isCyr(content);

  let status;
  if (!tCyr && !cCyr) status = 'GERMAN-ONLY';
  else if ((tCyr || cCyr) && (tWords.length + cWords.length) >= 1) status = 'HYBRID';
  else if (tWords.length === 0 && cWords.length === 0) status = 'OK';
  else status = 'HYBRID';

  return { status, tWords, cWords };
}

function parseItin(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const p = JSON.parse(val);
      if (Array.isArray(p)) return p;
    } catch {}
  }
  return null;
}

(async () => {
  const { data: tours } = await db.from('tours')
    .select('id, slug, name, itinerary')
    .eq('active', true)
    .order('slug', { ascending: true });

  console.log('Total active tours fetched:', (tours || []).length);

  for (const t of tours || []) {
    const deItin = parseItin(t.itinerary);
    if (!deItin) continue;

    const { data: ruRows } = await db.from('content_translations')
      .select('id, itinerary, content')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .eq('locale', 'ru');
    const ruRow = ruRows?.[0];
    if (!ruRow) continue;

    // App reads tr.itinerary ?? tr.content (mergeTranslation line 376)
    const ruItin = parseItin(ruRow.itinerary) ?? parseItin(ruRow.content);
    if (!ruItin) continue;

    const issues = [];
    ruItin.forEach((step, i) => {
      const cls = classifyStep(step);
      if (cls.status !== 'OK') {
        issues.push({ i, ...cls, step });
      }
    });

    if (issues.length === 0) continue;

    console.log('\n==============================');
    console.log('TOUR:', t.slug);
    console.log('  RU row id:', ruRow.id, '| RU itinerary source column:', Array.isArray(ruRow.itinerary) ? 'itinerary' : (typeof ruRow.content === 'string' ? 'content (JSON string)' : 'none'));
    console.log('  DE steps:', deItin.length, '| RU steps:', ruItin.length);
    console.log('  broken/hybrid steps:', issues.length);
    for (const iss of issues) {
      console.log(`  [step ${iss.i}] ${iss.status} | DE title: "${deItin[iss.i]?.title}" | RU title: "${iss.step.title}"`);
      console.log(`      DE content: "${String(deItin[iss.i]?.content || '').substring(0, 120)}"`);
      console.log(`      RU content: "${String(iss.step.content || '').substring(0, 120)}"`);
    }
  }
})();
