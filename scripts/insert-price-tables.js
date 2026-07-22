const { createClient } = require('@supabase/supabase-js');
const tables = require('./tour-tables.json');
const supabase = createClient(
  'https://bgweumxabgkkqnvifaik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I'
);

function buildTableHtml(tableEntry) {
  const rows = tableEntry.tableData;
  if (!rows || rows.length < 2) return '';

  const header = rows[0];
  const body = rows.slice(1);

  let html = '<table class="tour-pricing-table">';
  html += '<thead><tr>';
  header.forEach(h => { html += `<th>${h}</th>`; });
  html += '</tr></thead>';
  html += '<tbody>';
  body.forEach(row => {
    html += '<tr>';
    row.forEach(cell => { html += `<td>${cell}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

async function main() {
  let updated = 0;

  for (const entry of tables) {
    if (entry.title !== 'Preis') continue;
    if (!entry.tableData || entry.tableData.length < 2) continue;

    const tableHtml = buildTableHtml(entry);
    if (!tableHtml) continue;

    const { data: tour, error: fetchErr } = await supabase
      .from('tours')
      .select('description')
      .eq('slug', entry.slug)
      .single();

    if (fetchErr) {
      console.log('FETCH ERROR', entry.slug, fetchErr.message);
      continue;
    }

    let existingDesc = tour.description || '';

    if (existingDesc.includes('class="tour-pricing-table"')) {
      existingDesc = existingDesc.replace(/<table class="tour-pricing-table">[\s\S]*?<\/table>/, tableHtml);
    } else {
      existingDesc = tableHtml + '\n' + existingDesc;
    }

    const { error } = await supabase
      .from('tours')
      .update({ description: existingDesc })
      .eq('slug', entry.slug);

    if (error) {
      console.log('ERROR', entry.slug, error.message);
    } else {
      const rowText = entry.tableData.slice(1).map(r => r[0]).join(', ');
      console.log('OK', entry.slug, '| rows:', entry.tableData.length - 1, '|', rowText);
      updated++;
    }
  }

  console.log('\nUpdated', updated, 'tours with pricing tables');
}

main();
