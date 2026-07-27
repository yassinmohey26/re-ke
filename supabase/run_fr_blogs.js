require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const fs=require('fs');
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const updates=JSON.parse(fs.readFileSync('fr_blog_updates_safe.json','utf8'));
(async()=>{
  for(const u of updates){
    const {error}=await sb.from('content_translations').upsert({
      table_name: 'blog_posts',
      row_id: u.row_id,
      locale: u.locale,
      name: u.name,
      title: u.title,
      excerpt: u.excerpt,
      content: u.content
    }, {onConflict: 'table_name,row_id,locale'});
    if(error) console.log(u.row_id.substring(0,12), 'ERROR:', error.message);
    else console.log(u.row_id.substring(0,12), 'UPDATED');
  }
})();