// scripts/fetch-mega-safari-hurghada.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  const slug = 'mega-safari-hurghada';
  const { data: tour, error: tourErr } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .single();
  if (tourErr) {
    console.error('Error fetching tour:', tourErr);
    process.exit(1);
  }

  const { data: deTrans, error: deErr } = await supabase
    .from('content_translations')
    .select('*')
    .eq('table_name', 'tours')
    .eq('row_id', tour.id)
    .eq('locale', 'de')
    .single();

  // Merge fields: prefer deTrans if present
  const fields = [
    'name',
    'short_description',
    'description',
    'category_label',
    'highlights',
    'included',
    'not_included',
    'duration',
    'meeting_point',
    'faqs',
    'itinerary',
  ];
  const result = { id: tour.id, slug: tour.slug };
  for (const f of fields) {
    if (deTrans && deTrans[f] != null && deTrans[f] !== '') {
      result[f] = deTrans[f];
    } else {
      result[f] = tour[f];
    }
  }
  console.log(JSON.stringify(result, null, 2));
})();
