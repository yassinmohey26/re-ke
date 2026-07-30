require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data: tours } = await db.from('tours').select('id, slug, category_label');
  const { data: cts } = await db.from('content_translations').select('*').eq('table_name', 'tours');
  const frCts = cts.filter(c => c.locale === 'fr');

  console.log('=== FR category_label actual values vs DE ===');
  for (const tour of tours) {
    const fr = frCts.find(c => c.row_id === tour.id);
    if (fr?.category_label) {
      const match = fr.category_label === tour.category_label ? '=DE (still German)' : 'translated';
      console.log(' ' + tour.slug.substring(0,40) + ' | DE: "' + tour.category_label + '" | FR: "' + fr.category_label + '" [' + match + ']');
    } else {
      console.log(' ' + tour.slug.substring(0,40) + ' | null/missing');
    }
  }

  // Duration regex test
  console.log('\n=== Duration regex test ===');
  const tests = ['2 Tage 1 Nacht', '1 Tag 1 Nacht', '15 Stunden', '4 Stunden'];
  tests.forEach(t => {
    let r = t.replace('Tage', 'Days').replace('Tag', 'Day').replace('Nacht', 'Night').replace('Stunden', 'Hours');
    console.log(' "' + t + '" -> "' + r + '"');
  });
})();
