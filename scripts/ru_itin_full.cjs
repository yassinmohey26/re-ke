/* DRY-RUN READ-ONLY — full DE + RU itinerary dump for flagged tours. */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SLUGS = [
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
  'eden-island-schnorchelausflug-hurghada',
  'eintrittskarte-zum-hurghada-grand-aquarium',
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm',
  'family-abendsafari-hurghada',
  'glasbodenboot-hurghada-mit-schnorcheln',
  'hula-hula-insel-schnorchelausflug-hurghada',
  'hurghada-shopping-tour-basar-transfer',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum',
  'kloester-st-antonius-st-paulus',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'mahmya-insel-ausflug-hurghada',
  'makadi-water-park-hurghada-mittagessen-transfer',
  'mini-egypt-park-hurghada',
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
  'private-delfin-tour-hurghada',
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'quad-tour-hurghada-kamelritt',
  'super-safari-hurghada',
];

function parseItin(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const p = JSON.parse(val); if (Array.isArray(p)) return p; } catch {} }
  return null;
}

(async () => {
  const { data: tours } = await db.from('tours')
    .select('id, slug, name, itinerary')
    .in('slug', SLUGS);

  const out = [];
  for (const t of tours || []) {
    const deItin = parseItin(t.itinerary) || [];
    const { data: ruRows } = await db.from('content_translations')
      .select('id, itinerary, content')
      .eq('table_name', 'tours')
      .eq('row_id', t.id)
      .eq('locale', 'ru');
    const ruRow = ruRows?.[0];
    const ruItin = ruRow ? (parseItin(ruRow.itinerary) ?? parseItin(ruRow.content)) : null;

    out.push({ slug: t.slug, name: t.name, ruId: ruRow?.id, de: deItin, ru: ruItin });
  }

  const fs = require('fs');
  fs.writeFileSync(require('path').join(__dirname, 'ru_itin_full.json'), JSON.stringify(out, null, 1), 'utf8');
  console.log('Wrote ru_itin_full.json with', out.length, 'tours');
  for (const o of out) {
    console.log(`${o.slug} | RU row=${o.ruId} | deSteps=${o.de.length} ruSteps=${o.ru ? o.ru.length : 'MISSING'}`);
  }
})();
