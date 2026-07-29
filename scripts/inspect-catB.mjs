import { createClient } from '@supabase/supabase-js';

const db = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

const catBSlugs = [
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

const { data: tours } = await db.from('tours').select('id, slug, itinerary').in('slug', catBSlugs);
if (!tours) process.exit(1);

const ids = tours.map(t => t.id);
const { data: translations } = await db
  .from('content_translations')
  .select('row_id, locale, content')
  .eq('table_name', 'tours')
  .in('row_id', ids);

if (!translations) process.exit(1);

for (const slug of catBSlugs) {
  const tour = tours.find(t => t.slug === slug);
  if (!tour) continue;
  const tls = translations.filter(tr => tr.row_id === tour.id && tr.content);
  console.log(`\n===== ${slug} =====`);
  console.log(`German itinerary count: ${Array.isArray(tour.itinerary) ? tour.itinerary.length : 'N/A'}`);
  for (const tl of tls) {
    console.log(`\n--- ${tl.locale} ---`);
    try {
      const steps = JSON.parse(tl.content);
      console.log(`  Steps: ${steps.length}`);
      steps.forEach((s, i) => {
        console.log(`  [${i}] title="${(s.title||'').substring(0,60)}" content="${(s.content||'').substring(0,80)}"`);
      });
    } catch {
      console.log(`  RAW: ${tl.content.substring(0, 200)}`);
    }
  }
}
