const fs=require('fs');
const src=fs.readFileSync('lib/validations.ts','utf8');
const fixed=src.replace(/\.optional\(\)\.default\("full"\)/g, '.default("full")');
fs.writeFileSync('lib/validations.ts', fixed);
console.log('Fixed paymentOption in schema');