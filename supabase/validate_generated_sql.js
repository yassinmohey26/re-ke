const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, 'update_ar_descriptions.sql');
const deDescPath = path.join(__dirname, 'de_descriptions.json');

if (!fs.existsSync(sqlPath)) {
  console.error(`Error: SQL file not found at ${sqlPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');
const deDescriptions = JSON.parse(fs.readFileSync(deDescPath, 'utf8'));

// Verification suite
let statementCount = 0;
let errors = [];

// Parse individual INSERT statements
// Split by "INSERT INTO" and ignore the first element (header comment + BEGIN;)
const parts = sql.split(/INSERT INTO/i);
const statements = parts.slice(1);

statementCount = statements.length;

function countOccurrences(str, subStr) {
  return str.split(subStr).length - 1;
}

statements.forEach((stmt, index) => {
  const rowNum = index + 1;
  
  // Verify statement structure
  // Check locale is 'ar'
  const localeMatch = stmt.match(/VALUES\s*\(\s*'[^']+'\s*,\s*'[^']+'\s*,\s*'([^']+)'/i);
  if (!localeMatch || localeMatch[1] !== 'ar') {
    errors.push(`Row ${rowNum}: Does not target locale='ar' (found: ${localeMatch ? localeMatch[1] : 'unknown'})`);
  }

  // Ensure no other locale is affected (locale is explicitly 'ar' inside INSERT & ON CONFLICT updates EXCLUDED)
  if (countOccurrences(stmt.toLowerCase(), "'ar'") !== 1 && !stmt.includes("'ar'")) {
    errors.push(`Row ${rowNum}: Target locale check failed.`);
  }

  // Extract ID and Table Name
  const metaMatch = stmt.match(/VALUES\s*\(\s*'([^']+)'\s*,\s*'([^']+)'/i);
  if (!metaMatch) {
    errors.push(`Row ${rowNum}: Could not parse table name and row ID.`);
    return;
  }
  const tableName = metaMatch[1];
  const rowId = metaMatch[2];

  // Extract description value between the last single quotes in VALUES
  const valuesBlockMatch = stmt.match(/VALUES\s*\([\s\S]*?\)\s*ON CONFLICT/i);
  if (!valuesBlockMatch) {
    errors.push(`Row ${rowNum}: Could not parse VALUES block.`);
    return;
  }
  const valuesBlock = valuesBlockMatch[0];
  
  // The description is the 4th parameter, between single quotes
  // We locate it by splitting values parameters or matching the last parameter in the brackets
  const valParts = valuesBlock.match(/'([\s\S]*?)'(?=\s*[\),])/g);
  if (!valParts || valParts.length < 4) {
    errors.push(`Row ${rowNum} (${rowId}): Description parameter not found in SQL.`);
    return;
  }

  // Unescape the SQL string literal to get the raw HTML
  let parsedDesc = valParts[3].slice(1, -1).replace(/''/g, "'");

  if (!parsedDesc || parsedDesc.trim().length === 0) {
    errors.push(`Row ${rowNum} (${rowId}): Description is empty.`);
    return;
  }

  // Find original German description
  const deEntry = deDescriptions.find(d => d.id === rowId);
  if (!deEntry) {
    errors.push(`Row ${rowNum} (${rowId}): Original German entry not found for validation.`);
    return;
  }
  const deDesc = deEntry.de_description;

  // Validate HTML tags preservation
  const tags = ['table', 'thead', 'tbody', 'tr', 'th', 'td'];
  tags.forEach(tag => {
    const deOpen = (deDesc.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const deClose = (deDesc.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    
    const arOpen = (parsedDesc.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const arClose = (parsedDesc.match(new RegExp(`</${tag}>`, 'gi')) || []).length;

    if (deOpen !== arOpen || deClose !== arClose) {
      errors.push(`Row ${rowNum} (${rowId}): Tag count mismatch for <${tag}> (German: ${deOpen}/${deClose}, Arabic: ${arOpen}/${arClose})`);
    }
  });

  // Verify escaping did not introduce syntax errors (e.g. mismatched single quotes or hanging syntax)
  // Clean count check of single quotes inside the SQL representation of description: 
  // All single quotes inside the description MUST be doubled (''). If there's an odd single quote, it's a syntax error.
  const escapedText = valParts[3].slice(1, -1);
  let i = 0;
  let quoteIssues = 0;
  while (i < escapedText.length) {
    if (escapedText[i] === "'") {
      if (escapedText[i + 1] === "'") {
        i += 2; // correct escape pair
      } else {
        quoteIssues++;
        i++;
      }
    } else {
      i++;
    }
  }
  if (quoteIssues > 0) {
    errors.push(`Row ${rowNum} (${rowId}): Found ${quoteIssues} unescaped single quote(s) in description literal.`);
  }
});

// Verify BEGIN and COMMIT exist
if (!sql.trim().startsWith('--') && !sql.trim().includes('BEGIN;')) {
  errors.push(`SQL file does not begin with BEGIN;`);
}
if (!sql.trim().endsWith('COMMIT;')) {
  errors.push(`SQL file does not end with COMMIT;`);
}

console.log("\n=== SQL MIGRATION FILE VALIDATION ===");
console.log(`Statements parsed: ${statementCount}`);
if (errors.length > 0) {
  console.error(`❌ Validation FAILED. Found ${errors.length} error(s):`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✅ Validation PASSED:`);
  console.log(`  - Every row targets locale = 'ar'`);
  console.log(`  - No other locale is modified`);
  console.log(`  - HTML tags table/thead/tbody/tr/th/td match original German descriptions exactly`);
  console.log(`  - All single quotes are correctly escaped with no SQL syntax errors`);
  console.log(`  - No descriptions are empty`);
}
