require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const slugs = [
  'glasbodenboot-hurghada-mit-schnorcheln',
  'mahmya-insel-ausflug-hurghada',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'private-delfin-tour-hurghada',
  'kloester-st-antonius-st-paulus'
];

(async () => {
  for (const slug of slugs) {
    const { data: tour } = await db.from('tours').select('id, slug, name, short_description, description').eq('slug', slug).single();
    const { data: en } = await db.from('content_translations').select('short_description, description, name').eq('table_name', 'tours').eq('row_id', tour.id).eq('locale', 'en').single();

    console.log('\n' + '='.repeat(70));
    console.log('TOUR: ' + slug);
    console.log('DE name: ' + tour.name);
    console.log('EN name: ' + en.name);
    console.log('');

    console.log('--- short_description (DE) ---');
    console.log(tour.short_description || '(empty)');
    console.log('');
    console.log('--- short_description (EN — current, still German) ---');
    console.log(en.short_description || '(empty)');
    console.log('');

    console.log('--- description (DE) ---');
    console.log(tour.description || '(empty)');
    console.log('');
    console.log('--- description (EN — current, still German) ---');
    console.log(en.description || '(empty)');
    console.log('');
  }
})();
