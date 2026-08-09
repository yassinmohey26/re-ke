/* READ-ONLY — full DE + <locale> itinerary dump for flagged tours. Usage: node scripts/itin_full_locale.cjs <fr|hu> */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LOCALE = process.argv[2];
if (!['fr', 'hu'].includes(LOCALE)) { console.error('Usage: node scripts/itin_full_locale.cjs <fr|hu>'); process.exit(1); }

function parseItin(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const p = JSON.parse(val); if (Array.isArray(p)) return p; } catch {} }
  return null;
}

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

function germanWords(text) {
  return String(text || '').split(/[^A-Za-z\u00C0-\u017F\-']+/)
    .filter(w => w.length > 0 && DE_WORDS.has(w));
}

(async () => {
  const { data: tours } = await db.from('tours')
    .select('id, slug, name, itinerary')
    .eq('active', true);

  const out = [];
  for (const t of tours || []) {
    const deItin = parseItin(t.itinerary) || [];
    const { data: rows } = await db.from('content_translations')
      .select('id, itinerary, content')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .eq('locale', LOCALE);
    const row = rows?.[0];
    const locItin = row ? (parseItin(row.itinerary) ?? parseItin(row.content)) : null;
    if (!locItin) continue;
    const broken = locItin.some(s => germanWords(s.title).length + germanWords(s.content).length > 0);
    const missingDe = deItin.length > 0 && locItin.length === 0;
    if (!broken && !missingDe) continue;
    out.push({ slug: t.slug, name: t.name, locId: row?.id, de: deItin, loc: locItin });
  }

  const fs = require('fs');
  fs.writeFileSync(require('path').join(__dirname, `${LOCALE}_itin_full.json`), JSON.stringify(out, null, 1), 'utf8');
  console.log(`Wrote ${LOCALE}_itin_full.json with`, out.length, 'tours');
  for (const o of out) console.log(`${o.slug} | id=${o.locId} | deSteps=${o.de.length} locSteps=${o.loc.length}`);
})();
