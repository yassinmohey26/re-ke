require('dotenv').config({ path: require('path').join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function textToHtml(text) {
  if (!text) return text;
  if (text.includes('<')) return text; // Already has HTML
  return text
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p>${line.trim()}</p>`)
    .join('\n');
}

async function main() {
  const { data: tours } = await sb.from('tours').select('id,slug,description').eq('locale', 'de');
  let updated = 0;
  for (const tour of tours) {
    if (!tour.description || tour.description.includes('<')) continue;
    const html = textToHtml(tour.description);
    const { error } = await sb.from('tours').update({ description: html, updated_at: new Date().toISOString() }).eq('id', tour.id);
    if (error) console.log(`ERROR: ${tour.slug}: ${error.message}`);
    else { console.log(`OK: ${tour.slug}: ${html.length}ch`); updated++; }
  }
  console.log(`\nDone: ${updated} descriptions converted to HTML`);
}

main().catch(console.error);
