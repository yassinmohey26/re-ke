require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {data}=await sb.from('content_translations').select('row_id,category_label,name').eq('table_name','tours').eq('locale','ar');
  for(const r of data){
    console.log(r.category_label?.padEnd(40), r.name?.substring(0,60));
  }
})();