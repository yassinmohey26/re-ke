require('dotenv').config({ path: require('path').join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const scraped = JSON.parse(fs.readFileSync('C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\scraped-tours.json', 'utf8'));

async function main() {
  // Get all DE tours with their IDs
  const { data: tours } = await sb.from('tours').select('id,slug').eq('locale', 'de');
  const slugToId = {};
  for (const t of tours) slugToId[t.slug] = t.id;
  
  let updated = 0;
  let skipped = 0;
  
  for (const item of scraped) {
    const tourId = slugToId[item.slug];
    if (!tourId) {
      console.log(`SKIP: ${item.slug} - not found in DB`);
      skipped++;
      continue;
    }
    
    const update = {};
    
    // Only update if scraped data is better (longer description, more items)
    if (item.description && item.description.length > 50) {
      update.description = item.description;
    }
    
    if (item.highlights && item.highlights.length > 0) {
      update.highlights = item.highlights;
    }
    
    if (item.included && item.included.length > 0) {
      update.included = item.included;
    }
    
    if (item.not_included && item.not_included.length > 0) {
      update.not_included = item.not_included;
    }
    
    if (item.faqs && item.faqs.length > 0) {
      update.faqs = item.faqs;
    }
    
    if (item.itinerary && item.itinerary.length > 0) {
      update.itinerary = item.itinerary;
    }
    
    if (item.meeting_point) {
      update.meeting_point = item.meeting_point;
    }
    
    if (item.duration) {
      update.duration = item.duration;
    }
    
    if (Object.keys(update).length === 0) {
      console.log(`SKIP: ${item.slug} - no data to update`);
      skipped++;
      continue;
    }
    
    update.updated_at = new Date().toISOString();
    
    const { error } = await sb.from('tours').update(update).eq('id', tourId);
    
    if (error) {
      console.log(`ERROR: ${item.slug}: ${error.message}`);
    } else {
      const fields = Object.keys(update).filter(k => k !== 'updated_at');
      console.log(`OK: ${item.slug} [${fields.join(', ')}]`);
      updated++;
    }
  }
  
  console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
}

main().catch(console.error);
