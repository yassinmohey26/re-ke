const fs=require('fs');
const sql=fs.readFileSync('migrations/003v3_fix_ar_ru_content_translations_idempotent.sql','utf8');
const ruTours=sql.split('-- Row ').filter(s=>s.includes('tours') && s.includes("'ru'"));
console.log('RU tour rows:', ruTours.length);
let withFaqs=0;
for(const t of ruTours){
  if(t.includes('"q":"') && t.includes('"a":"')){
    withFaqs++;
  }
}
console.log('RU tours with FAQs:', withFaqs);

const sample=ruTours.find(t=>t.includes('27ae0b35-e0e'));
if(sample){
  const faqMatch=sample.match(/faqs.*?(\[.*?\])/s);
  if(faqMatch) console.log('Sample FAQ:', faqMatch[1].substring(0,200));
}