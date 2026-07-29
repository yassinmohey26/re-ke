const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const slugs = [
  'el-gouna-private-stadtrundfahrt-mit-lagunenfahrt-aussichtsturm',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel',
  'eintrittskarte-zum-hurghada-grand-aquarium',
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'hurghada-shopping-tour-basar-transfer',
  'privater-speedboot-ausflug-in-hurghada-schnorcheln-an-korallenriffen-sonnenuntergang',
  'private-delfin-tour-hurghada',
  'private-speedboot-tour-orange-bay-hurghada',
  'eden-island-schnorchelausflug-hurghada',
  'orange-bay-insel-schnorchelausflug-hurghada',
  'glasbodenboot-hurghada-mit-schnorcheln',
  'quad-tour-hurghada-kamelritt',
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
  'mini-egypt-park-hurghada',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'kloester-st-antonius-st-paulus',
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum',
  'makadi-water-park-hurghada-mittagessen-transfer',
  'mahmya-insel-ausflug-hurghada',
  'hula-hula-insel-schnorchelausflug-hurghada',
  'super-safari-hurghada',
];

async function main() {
  const tours = await db.tours.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true, itinerary: true },
  });

  const sorted = slugs.map(s => tours.find(t => t.slug === s)).filter(Boolean);

  for (const t of sorted) {
    console.log(`\n===== ${t.slug} =====`);
    console.log(`ID: ${t.id}`);
    console.log(JSON.stringify(t.itinerary, null, 2));
  }

  // Check content_translations for these
  const ids = sorted.map(t => t.id);
  const translations = await db.content_translations.findMany({
    where: {
      table_name: 'tours',
      column_name: 'itinerary',
      record_id: { in: ids },
    },
    select: { record_id: true, locale: true },
  });

  console.log('\n\n=== EXISTING TRANSLATIONS ===');
  for (const t of sorted) {
    const has = translations.filter(tr => tr.record_id === t.id).map(tr => tr.locale);
    console.log(`${t.slug}: ${has.join(', ') || '(none)'}`);
  }

  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
