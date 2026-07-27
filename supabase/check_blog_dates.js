require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {data}=await sb.from('blog_posts').select('id,slug,title,date,created_at').order('created_at');
  for(const r of data){
    console.log(r.id.substring(0,12),'|',r.slug?.substring(0,30),'|',r.date,'|',r.title?.substring(0,40));
  }
})();