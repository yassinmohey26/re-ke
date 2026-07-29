import { createClient } from '@supabase/supabase-js';

const db = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

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

const { data: tours } = await db.from('tours').select('id, slug').in('slug', slugs);
if (!tours) { console.error('No tours found'); process.exit(1); }

const ids = tours.map(t => t.id);

const { data: translations } = await db
  .from('content_translations')
  .select('row_id, locale, content')
  .eq('table_name', 'tours')
  .in('row_id', ids);

if (!translations) { console.log('No translations found'); process.exit(1); }

for (const slug of slugs) {
  const tour = tours.find(t => t.slug === slug);
  if (!tour) { console.log(`${slug}: NOT FOUND`); continue; }
  const tls = translations.filter(tr => tr.row_id === tour.id);
  const locales = tls.map(t => t.locale);
  const hasContent = tls.filter(t => t.content !== null && t.content !== undefined).map(t => t.locale);
  
  // Check if content contains actual itinerary steps
  const hasItinerary = tls.filter(t => {
    if (!t.content) return false;
    try {
      const c = JSON.parse(t.content);
      return Array.isArray(c) && c.length > 0;
    } catch { return false; }
  }).map(t => t.locale);

  console.log(`${slug}: locales=[${locales.join(',')}] contentItin=[${hasItinerary.join(',')}]`);
}
