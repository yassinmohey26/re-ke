const { createClient } = require('@supabase/supabase-js');
const prices = require('./tour-prices.json');

const supabase = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

async function main() {
  let ok = 0, fail = 0;
  for (const t of prices) {
    const { error } = await supabase
      .from('tours')
      .update({ price: t.price })
      .eq('slug', t.slug);
    if (error) {
      console.log('FAIL', t.slug, error.message);
      fail++;
    } else {
      console.log('OK', t.slug, '€' + t.price);
      ok++;
    }
  }
  console.log(`\nDone: ${ok} updated, ${fail} failed`);
}

main();
