require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{
  const {data,error}=await sb.from('bookings').select('*').limit(1);
  if(error){console.log('ERROR:',error.message);return;}
  console.log('Columns:',Object.keys(data[0]||{}).join(', '));
  console.log('Row count sample:',data.length);
})();