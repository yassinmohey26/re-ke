const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

function parsePhpSerialized(str) {
  if (!str || !str.startsWith('a:')) return null;
  const addrMatch = str.match(/s:7:"address";s:\d+:"([^"]+)"/);
  const locMatch = str.match(/s:8:"location";s:\d+:"([^"]+)"/);
  return {
    address: addrMatch ? addrMatch[1] : null,
    location: locMatch ? locMatch[1] : null,
  };
}

async function main() {
  const { data: tours } = await supabase.from('tours').select('slug, meeting_point, description').order('name');

  let updated = 0;

  for (const tour of tours) {
    const mp = tour.meeting_point || '';
    if (!mp.startsWith('a:')) continue;

    const parsed = parsePhpSerialized(mp);
    const address = parsed?.address || 'Hurghada - Rotes Meer - Aegypten';

    const { error } = await supabase
      .from('tours')
      .update({ meeting_point: address })
      .eq('slug', tour.slug);

    if (error) {
      console.log('ERROR', tour.slug, error.message);
    } else {
      console.log('OK', tour.slug, '->', address);
      updated++;
    }
  }

  console.log('\nUpdated', updated, 'tours with cleaned meeting_point');
}

main();
