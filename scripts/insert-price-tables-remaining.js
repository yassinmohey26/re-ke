const { createClient } = require('@supabase/supabase-js');
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
  let html = '<table class="tour-pricing-table">';
  html += '<thead><tr>';
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
  let updated = 0;
  const failedSlugs = ['super-safari-hurghada', 'quad-tour-hurghada-kamelritt', 'reiten-in-hurghada-strand-wueste-pferde-im-meer', '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben'];

  for (const entry of tables) {
    if (!failedSlugs.includes(entry.slug)) continue;
    if (entry.title !== 'Preis') continue;

    const tableHtml = buildTableHtml(entry);
    if (!tableHtml) continue;

    const { data: tours, error: fetchErr } = await supabase
      .from('tours')
      .select('id, description')
      .eq('slug', entry.slug);

    if (fetchErr) {
      console.log('FETCH ERROR', entry.slug, fetchErr.message);
      continue;
    }

    if (!tours || tours.length === 0) {
      console.log('NOT FOUND', entry.slug);
      continue;
    }

    for (const tour of tours) {
      let existingDesc = tour.description || '';
      if (existingDesc.includes('class="tour-pricing-table"')) {
        existingDesc = existingDesc.replace(/<table class="tour-pricing-table">[\s\S]*?<\/table>/, tableHtml);
      } else {
        existingDesc = tableHtml + '\n' + existingDesc;
      }
      const { error } = await supabase
        .from('tours')
        .update({ description: existingDesc })
        .eq('id', tour.id);
      if (error) {
        console.log('UPDATE ERROR', entry.slug, tour.id, error.message);
      } else {
        console.log('OK', entry.slug, '| id:', tour.id);
        updated++;
      }
    }
  }
  console.log('\nUpdated', updated, 'remaining tours');
}

main();
