require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const fs = require('fs');
const review = JSON.parse(fs.readFileSync(__dirname + '/batch1-en-full.json', 'utf8'));

(async () => {
  const { data: tours } = await db.from('tours').select('*').in('slug', [
    'glasbodenboot-hurghada-mit-schnorcheln',
    'mahmya-insel-ausflug-hurghada',
    'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
    'private-delfin-tour-hurghada',
    'kloester-st-antonius-st-paulus'
  ]);

  for (const item of review) {
    const tour = tours.find(t => t.slug === item.slug);
    if (!tour) { console.log('❌ Missing tour:', item.slug); continue; }

    const en = item.after;
    const payload = {
      name: en.name,
      short_description: en.short_description,
      description: en.description,
      highlights: en.highlights,
      included: en.included,
      not_included: en.not_included,
      content: JSON.stringify(en.itinerary),
      faqs: en.faqs,
      meeting_point: tour.meeting_point,
      duration: tour.duration
    };

    const { data: existing } = await db.from('content_translations')
      .select('id').eq('table_name','tours').eq('row_id', tour.id).eq('locale','en').limit(1);

    if (existing?.length) {
      const { error } = await db.from('content_translations').update(payload).eq('id', existing[0].id);
      if (error) { console.error(`❌ UPDATE ${item.slug}:`, error.message); }
      else console.log(`✅ Updated EN: ${item.slug}`);
    } else {
      const { error } = await db.from('content_translations').insert({
        table_name: 'tours', row_id: tour.id, locale: 'en', ...payload
      });
      if (error) { console.error(`❌ INSERT ${item.slug}:`, error.message); }
      else console.log(`✅ Inserted EN: ${item.slug}`);
    }
  }
  console.log('\nBatch 1 written to DB!');
})();
