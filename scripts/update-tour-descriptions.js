const { createClient } = require('@supabase/supabase-js');
const descriptions = require('./tour-descriptions.json');

const supabase = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#8212;/g, ' - ').replace(/\s+/g, ' ').trim();
}

async function main() {
  let updated = 0;
  let errors = 0;

  for (const tour of descriptions) {
    if (tour.error) {
      console.log(`SKIP ${tour.slug}: ${tour.error}`);
      errors++;
      continue;
    }

    // Clean description HTML
    let descHtml = tour.descriptionHtml || '';
    // Remove the wrapper div tags
    descHtml = descHtml.replace(/<\/?div[^>]*>/gi, '');
    // Convert <br /> to newlines for cleaner display
    descHtml = descHtml.replace(/<br\s*\/?>/gi, '\n');

    // Build highlights as JSON array (already extracted)
    const highlights = tour.highlights || [];
    const included = tour.included || [];
    const excluded = tour.excluded || [];
    const faqs = tour.faqs || [];

    const updateData = {
      description: descHtml,
      highlights: highlights,
      included: included,
      not_included: excluded,
      faqs: faqs,
    };

    const { error } = await supabase
      .from('tours')
      .update(updateData)
      .eq('slug', tour.slug);

    if (error) {
      console.log(`ERROR ${tour.slug}: ${error.message}`);
      // Try with just description if full update fails
      const { error: err2 } = await supabase
        .from('tours')
        .update({ description: descHtml })
        .eq('slug', tour.slug);
      if (err2) {
        console.log(`  Also failed description-only: ${err2.message}`);
        errors++;
      } else {
        console.log(`  Updated description only`);
        updated++;
      }
    } else {
      console.log(`OK ${tour.slug} - desc: ${descHtml.length}ch, ${highlights.length} hl, ${included.length} inc, ${excluded.length} exc, ${faqs.length} faq`);
      updated++;
    }
  }

  console.log(`\nDone: ${updated} updated, ${errors} errors out of ${descriptions.length} tours`);
}

main();
