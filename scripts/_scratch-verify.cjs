require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const FR_SLUGS = [
  '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
  'eden-island-schnorchelausflug-hurghada',
  'eintrittskarte-zum-hurghada-grand-aquarium',
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm',
  'family-abendsafari-hurghada',
  'family-safari-hurghada',
  'glasbodenboot-hurghada-mit-schnorcheln',
  'hula-hula-insel-schnorchelausflug-hurghada',
  'hurghada-shopping-tour-basar-transfer',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum',
  'kloester-st-antonius-st-paulus',
  'luxor-tagesausflug-ab-hurghada',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'mahmya-insel-ausflug-hurghada',
  'makadi-water-park-hurghada-mittagessen-transfer',
  'mega-safari-hurghada',
  'mini-egypt-park-hurghada',
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
  'orange-bay-insel-schnorchelausflug-hurghada',
  'private-delfin-tour-hurghada',
  'private-speedboot-tour-orange-bay-hurghada',
  'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'quad-tour-hurghada-kamelritt',
  'super-safari-hurghada',
];

const HU_SLUGS = [
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
  'private-speedboot-tour-orange-bay-hurghada',
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'quad-tour-hurghada-kamelritt',
  'reiten-in-hurghada-strand-wueste-pferde-im-meer',
  'super-safari-hurghada',
];

function parseItin(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { const p = JSON.parse(val); if (Array.isArray(p)) return p; } catch {} }
  return null;
}

(async () => {
  const all = [...new Set([...FR_SLUGS, ...HU_SLUGS])];
  const { data: tours } = await db.from('tours')
    .select('id, slug, itinerary')
    .in('slug', all);
  const bySlug = Object.fromEntries((tours || []).map(t => [t.slug, t]));
  console.log('=== LIVE DE ITINERARIES (slug | steps | title[0] | title[last]) ===');
  for (const slug of all) {
    const t = bySlug[slug];
    if (!t) { console.log(`NO TOUR: ${slug}`); continue; }
    const itin = parseItin(t.itinerary) || [];
    const first = itin[0]?.title ?? '(none)';
    const last = itin[itin.length - 1]?.title ?? '(none)';
    console.log(`${slug} | ${itin.length} | ${first} | ${last}`);
  }
  console.log('\nSlug counts: FR', FR_SLUGS.length, 'HU', HU_SLUGS.length);
})();
