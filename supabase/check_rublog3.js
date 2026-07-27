const fs=require('fs');
const sql=fs.readFileSync('migrations/003v3_fix_ar_ru_content_translations_idempotent.sql','utf8');
const ruBlogs=sql.split('-- Row ').filter(s=>s.includes('blog_posts') && s.includes("'ru'"));
for(let i=0;i<ruBlogs.length;i++){
  const b=ruBlogs[i];
  const lines=b.split('\n').slice(0,4);
  console.log('--- Blog', i+1, '---');
  console.log(lines.join('\n'));
}