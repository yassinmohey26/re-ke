require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {data}=await sb.from('content_translations').select('row_id,locale,name,title').eq('table_name','blog_posts').order('row_id');
  const grouped={};
  for(const r of data){
    if(!grouped[r.row_id]) grouped[r.row_id]={};
    grouped[r.row_id][r.locale]=r.title?r.title.substring(0,80):'(null)';
  }
  for(const[id,locales] of Object.entries(grouped)){
    console.log('\n'+id.substring(0,12));
    for(const[locale,title] of Object.entries(locales)){
      console.log('  '+locale+': '+title);
    }
  }
})();