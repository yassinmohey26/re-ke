require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

(async()=>{
  try{
  const{data,error}=await supabase.from('content_translations_eav').select('*').limit(3);
  if(error)throw error;
  console.log('Total rows returned:',data.length);
  if(data.length===0){console.log('No data');return}
  console.log('Columns:',Object.keys(data[0]));
  for(const r of data){
    console.log('\n--- Row ---');
    for(const[k,v]of Object.entries(r)){
      const val=typeof v==='string'?v.substring(0,200):JSON.stringify(v);
      console.log(k+': '+val);
    }
  }
  }catch(e){console.log('Caught:',e.message);}
})();