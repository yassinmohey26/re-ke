/* DRY-RUN READ-ONLY — verify clean tours + detect missing RU itineraries. */
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

function isCyr(text) { return /[А-Яа-яЁё]/.test(text || ''); }
function germanWords(text) {
  return String(text || '').split(/[^A-Za-zÄÖÜäöüß\-']+/)
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

  const flagged = [];
  for (const t of tours || []) {
    const deItin = parseItin(t.itinerary);
    const { data: ruRows } = await db.from('content_translations')
      .select('id, itinerary, content')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .eq('locale', 'ru');
    const ruRow = ruRows?.[0];
    const ruItin = ruRow ? (parseItin(ruRow.itinerary) ?? parseItin(ruRow.content)) : null;

    if (!ruItin) {
      // No RU itinerary at all — app falls back to German base itinerary
      if (deItin && deItin.length > 0) {
        flagged.push({ slug: t.slug, kind: 'MISSING-RU-ITINERARY', deSteps: deItin.length, ruSteps: 0 });
      }
      continue;
    }

    let broken = 0;
    let gerOnly = 0;
    ruItin.forEach((step, i) => {
      const tw = germanWords(step.title); const cw = germanWords(step.content);
      const tC = isCyr(step.title); const cC = isCyr(step.content);
      if (tw.length + cw.length > 0) broken++;
      if (!tC && !cC) gerOnly++;
    });
    if (broken > 0) {
      flagged.push({ slug: t.slug, kind: 'BROKEN', deSteps: deItin?.length ?? 0, ruSteps: ruItin.length, broken, gerOnly });
    } else {
      console.log('CLEAN:', t.slug, `(ru steps=${ruItin.length}, de steps=${deItin?.length ?? 0})`);
    }
  }

  console.log('\n===== ALL FLAGGED =====');
  for (const f of flagged) {
    console.log(`${f.kind} | ${f.slug} | de=${f.deSteps} ru=${f.ruSteps}${f.broken ? ' broken=' + f.broken + ' gerOnly=' + f.gerOnly : ''}`);
  }
  console.log('\nTotal flagged:', flagged.length);
})();
