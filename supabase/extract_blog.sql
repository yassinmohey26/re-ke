const fs=require('fs');
const sql=fs.readFileSync('migrations/003v2_fix_ar_content_translations_idempotent.sql','utf8');
const lines=sql.split('\n');
let inBlog=false;
const blogLines=[];
for(const l of lines){
  if(l.includes('blog_posts')){
    inBlog=true;
  }
  if(inBlog) blogLines.push(l);
  if(inBlog && l.trim().endsWith(';') && l.includes('faqs = EXCLUDED.faqs')){
    inBlog=false;
  }
}
console.log(blogLines.join('\n'));