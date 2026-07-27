require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {data}=await sb.from('content_translations').select('row_id,name,locale').eq('locale','fr').eq('table_name','blog_posts');
  for(const r of data){
    console.log(r.row_id.substring(0,12), r.locale, r.name.substring(0,60));
  }
})();