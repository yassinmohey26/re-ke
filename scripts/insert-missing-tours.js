const { createClient } = require('@supabase/supabase-js');
const tours = require('./missing-tours.json');
const tables = require('./tour-tables.json');

const supabase = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

function buildTableHtml(entry) {
  const rows = entry.tableData;
  if (!rows || rows.length < 2) return '';
  const header = rows[0];
  const body = rows.slice(1);
  let html = '<table class="tour-pricing-table"><thead><tr>';
  header.forEach(h => { html += '<th>' + h + '</th>'; });
  html += '</tr></thead><tbody>';
  body.forEach(row => {
    html += '<tr>';
    row.forEach(cell => { html += '<td>' + cell + '</td>'; });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

async function main() {
  for (const tour of tours) {
    const tableEntry = tables.find(t => t.slug === tour.slug && t.title === 'Preis');
    let pricingHtml = '';
    if (tableEntry) {
      pricingHtml = buildTableHtml(tableEntry);
    }

    const fullDescription = pricingHtml
      ? pricingHtml + '\n' + (tour.description || '')
      : tour.description || '';

    const row = {
      slug: tour.slug,
      name: tour.name,
      short_description: tour.short_description || '',
      description: fullDescription,
      highlights: tour.highlights || [],
      included: tour.included || [],
      not_included: tour.not_included || [],
      faqs: tour.faqs || [],
      category: tour.category || 'ganztag',
      category_label: tour.category_label || '',
      destination: 'Hurghada',
      destination_slug: 'hurghada',
      duration: tour.duration || '8h',
      duration_hours: tour.duration_hours || 8,
      max_guests: tour.max_guests || 20,
      difficulty: 'leicht',
      min_age: tour.min_age || 6,
      image: tour.image || '',
      meeting_point: tour.meeting_point || 'Hurghada - Rotes Meer - Aegypten',
      active: true,
      featured: false,
    };

    const { error } = await supabase.from('tours').insert(row);
    if (error) {
      console.log('ERROR', tour.slug, error.message);
    } else {
      console.log('OK', tour.slug, '|', tour.name.substring(0, 50));
    }
  }
}

main();
