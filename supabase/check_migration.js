const fs=require('fs');
const sql=fs.readFileSync('migrations/003v3_fix_ar_ru_content_translations_idempotent.sql','utf8');

// Check AR tour FAQs
const arTours=sql.split('-- Row ').filter(s=>s.includes('tours') && s.includes("'ar'"));
let arWithFaqs=0;
for(const t of arTours){
  if(t.includes('{"q":"') && t.includes('"a":"')) arWithFaqs++;
}
console.log('AR Tours:', arTours.length, 'with FAQs:', arWithFaqs);

// Check RU tour FAQs
const ruTours=sql.split('-- Row ').filter(s=>s.includes('tours') && s.includes("'ru'"));
let ruWithFaqs=0;
for(const t of ruTours){
  if(t.includes('{"q":"') && t.includes('"a":"')) ruWithFaqs++;
}
console.log('RU Tours:', ruTours.length, 'with FAQs:', ruWithFaqs);

// Check RU blog posts
const ruBlogs=sql.split('-- Row ').filter(s=>s.includes('blog_posts') && s.includes("'ru'"));
let ruBlogsWithContent=0;
for(const b of ruBlogs){
  if(b.includes('t_title') && !b.includes('NULL, NULL, NULL, NULL')) ruBlogsWithContent++;
}
console.log('RU Blog posts:', ruBlogs.length, 'with content:', ruBlogsWithContent);