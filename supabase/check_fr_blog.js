require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {data}=await sb.from('content_translations').select('row_id,locale,name,title,excerpt,content').eq('table_name','blog_posts').eq('row_id','bc3112c6-a2e1-4475-997b-39e2a77e228e');
  console.log('Blog post translations:');
  for(const r of data||[]) console.log(r.locale, '| name:', (r.name||'').substring(0,60), '| title:', (r.title||'').substring(0,60), '| excerpt:', (r.excerpt||'').substring(0,60), '| content_len:', (r.content||'').length);
})();