import { createClient } from '@supabase/supabase-js';

const db = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

// Get one sample tour
const { data: tours } = await db.from('tours').select('id, slug, itinerary').limit(1);
const sampleId = tours[0].id;
console.log('Sample tour ID:', sampleId);

// Get any content_translations for it
const { data: tr } = await db
  .from('content_translations')
  .select('*')
  .eq('table_name', 'tours')
  .eq('row_id', sampleId);

console.log('Content translations for sample tour:');
console.log(JSON.stringify(tr, null, 2));

// Also check all distinct column_names
const { data: cols } = await db
  .from('content_translations')
  .select('column_name')
  .eq('table_name', 'tours')
  .limit(100);

if (cols) {
  const distinct = [...new Set(cols.map(c => c.column_name))];
  console.log('Distinct column_names:', distinct);
}

// Check one of the Cat B tours for existing translation
const catBSlugs = [
  'naechtliche-stadtrundfahrt-durch-hurghada-private-tour',
  'mini-egypt-park-hurghada',
];
const { data: catBTours } = await db.from('tours').select('id, slug').in('slug', catBSlugs);
if (catBTours) {
  const catBIds = catBTours.map(t => t.id);
  const { data: catBTr } = await db
    .from('content_translations')
    .select('*')
    .eq('table_name', 'tours')
    .in('row_id', catBIds);
  console.log('\nCategory B translations:');
  console.log(JSON.stringify(catBTr, null, 2));
}
