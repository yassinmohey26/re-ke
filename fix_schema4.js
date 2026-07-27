const fs=require('fs');
const src=fs.readFileSync('lib/validations.ts','utf8');
const fixed=src
  .replace(/paymentOption: z\.enum\(\['full', 'deposit'\]\)\.optional\(\)\.default\('full'\)/, "paymentOption: z.enum(['full', 'deposit']).default('full')")
  .replace(/paymentOption: z\.enum\("full", "deposit"\)\.optional\(\)\.default\("full"\)/, "paymentOption: z.enum(['full', 'deposit']).default('full')");
fs.writeFileSync('lib/validations.ts', fixed);
console.log('Fixed paymentOption in schema');