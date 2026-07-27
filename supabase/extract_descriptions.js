require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const ids = [
    '42a2941f','77f34e21','c2db0455','7cb0c635','2dc6864a','1c5a3c79','4f91f20d',
    '69aa0c36','17a82d9b','a8ddb433','0009b90b','b604535f','f265b20c','27ae0b35',
    'c7b7cfad','b2dc19de','6b629662','94351900','80dc4e17','65f786e7','380712ad',
    '872d19ae','a9e92b99','8c5d9ce5'
  ];

  const { data, error } = await supabase.from('content_translations')
    .select('row_id, table_name, name, description')
    .eq('locale', 'ar');

  if (error) { console.log('ERROR:', error.message); return; }

  const extracted = [];
  for (const row of data) {
    const shortId = row.row_id.substring(0,8);
    if (ids.includes(shortId) && row.description && row.description.length > 10) {
      extracted.push({
        id: row.row_id,
        shortId: shortId,
        table: row.table_name,
        name_ar: row.name,
        de_description: row.description
      });
    }
  }

  fs.writeFileSync('de_descriptions.json', JSON.stringify(extracted, null, 2));
  console.log('Extracted ' + extracted.length + ' descriptions');
  
  // Show structure analysis for first entity
  const first = extracted[0];
  console.log('\n=== FIRST ENTITY: ' + first.name_ar + ' ===');
  console.log('Length: ' + first.de_description.length + ' chars');
  
  // Count HTML tags
  const tags = first.de_description.match(/<[^>]+>/g) || [];
  const tableCount = (first.de_description.match(/<table/g) || []).length;
  const trCount = (first.de_description.match(/<tr/g) || []).length;
  const thCount = (first.de_description.match(/<th/g) || []).length;
  const tdCount = (first.de_description.match(/<td/g) || []).length;
  console.log('Tags: <table>=' + tableCount + ' <tr>=' + trCount + ' <th>=' + thCount + ' <td>=' + tdCount);
  
  // Extract price patterns
  const prices = first.de_description.match(/\d+[\.,]\d+\s*€/g) || [];
  console.log('Prices found: ' + prices.join(', '));
  
  // Extract person patterns
  const persons = first.de_description.match(/\d+[\s–-]+\d+\s*Person/g) || [];
  console.log('Person patterns: ' + persons.join(', '));
  
  // Show full HTML
  console.log('\n=== FULL HTML ===');
  console.log(first.de_description);
})();
