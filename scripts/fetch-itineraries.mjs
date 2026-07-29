import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgweumxabgkkqnvifaik.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I';

const db = createClient(supabaseUrl, supabaseKey);

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

const { data: tours } = await db.from('tours').select('id, slug, itinerary').in('slug', slugs);
if (!tours) { console.error('No tours found'); process.exit(1); }

const sorted = slugs.map(s => tours.find(t => t.slug === s)).filter(Boolean);

for (const t of sorted) {
  console.log(`\n===== ${t.slug} =====`);
  console.log(`ID: ${t.id}`);
  console.log(JSON.stringify(t.itinerary, null, 2));
}

// Check what content_translations exist for these
const ids = sorted.map(t => t.id);
const { data: translations } = await db
  .from('content_translations')
  .select('row_id, locale')
  .eq('table_name', 'tours')
  .eq('column_name', 'itinerary')
  .in('row_id', ids);

console.log('\n\n=== EXISTING TRANSLATIONS ===');
for (const t of sorted) {
  const has = (translations || []).filter(tr => tr.row_id === t.id).map(tr => tr.locale);
  console.log(`${t.slug}: ${has.join(', ') || '(none)'}`);
}
