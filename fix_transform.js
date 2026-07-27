const fs=require('fs');
const src=fs.readFileSync('lib/validations.ts','utf8');
const fixed=src.replace(
  'paymentOption: z.enum(["full", "deposit"]).default("full"),',
  'paymentOption: z.enum(["full", "deposit"]).transform(val => val ?? "full"),'
);
fs.writeFileSync('lib/validations.ts', fixed);
console.log('Fixed with transform');