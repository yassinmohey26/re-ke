const fs = require('fs');
const path = require('path');

const arDescPath = path.join(__dirname, 'ar_descriptions_translated.json');
const sqlOutputPath = path.join(__dirname, 'update_ar_descriptions.sql');

if (!fs.existsSync(arDescPath)) {
  console.error(`Error: File not found at ${arDescPath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(arDescPath, 'utf8'));

// 1. Verify exact count is 24
if (data.length !== 24) {
  console.error(`Error: Expected exactly 24 records, found ${data.length}`);
  process.exit(1);
}

// 2. Verify uniqueness of IDs and presence of required fields
const ids = new Set();
for (const record of data) {
  if (!record.id || !record.table || !record.ar_description) {
    console.error(`Error: Missing required fields in record:`, record);
    process.exit(1);
  }
  if (ids.has(record.id)) {
    console.error(`Error: Duplicate ID found: ${record.id}`);
    process.exit(1);
  }
  ids.add(record.id);
}

console.log("Pre-generation checks passed: 24 unique records with all required fields present.");

// Generate SQL SQL statements
let sqlContent = `-- Hurghada Reiseplaner Arabic Descriptions Migration\n`;
sqlContent += `BEGIN;\n\n`;

for (const record of data) {
  const table = record.table;
  const id = record.id;
  const arDesc = record.ar_description;
  
  // Escape single quotes for PostgreSQL string literals
  const escapedDesc = arDesc.replace(/'/g, "''");
  
  sqlContent += `INSERT INTO content_translations (\n`;
  sqlContent += `    table_name,\n`;
  sqlContent += `    row_id,\n`;
  sqlContent += `    locale,\n`;
  sqlContent += `    description\n`;
  sqlContent += `)\n`;
  sqlContent += `VALUES (\n`;
  sqlContent += `    '${table}',\n`;
  sqlContent += `    '${id}',\n`;
  sqlContent += `    'ar',\n`;
  sqlContent += `    '${escapedDesc}'\n`;
  sqlContent += `)\n`;
  sqlContent += `ON CONFLICT (table_name, row_id, locale)\n`;
  sqlContent += `DO UPDATE SET\n`;
  sqlContent += `    description = EXCLUDED.description;\n\n`;
}

sqlContent += `COMMIT;\n`;

fs.writeFileSync(sqlOutputPath, sqlContent, 'utf8');
console.log(`Generated ${sqlOutputPath} successfully.`);
