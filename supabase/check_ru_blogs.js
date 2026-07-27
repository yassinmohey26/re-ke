const fs=require('fs');
const sql=fs.readFileSync('migrations/003v3_fix_ar_ru_content_translations_idempotent.sql','utf8');
const ruBlogs=sql.split('-- Row ').filter(s=>s.includes('blog_posts') && s.includes("'ru'"));
console.log('RU Blog posts:', ruBlogs.length);
for(const b of ruBlogs){
  const hasTitle=b.includes('"title"') && !b.includes('NULL, NULL, NULL, NULL,');
  console.log('Has title/excerpt/content:', hasTitle);
}