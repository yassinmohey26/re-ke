const fs=require('fs');
const sql=fs.readFileSync('migrations/003v3_fix_ar_ru_content_translations_idempotent.sql','utf8');
const ruBlogs=sql.split('-- Row ').filter(s=>s.includes("blog_posts") && s.includes("'ru'"));
console.log('RU Blog post sections:', ruBlogs.length);
for(let i=0;i<Math.min(2,ruBlogs.length);i++){
  const lines=ruBlogs[i].split('\n').slice(0,20).join('\n');
  console.log('--- Blog', i+1, '---');
  console.log(lines.substring(0,500));
  console.log('...');
}