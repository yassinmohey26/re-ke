require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const fs=require('fs');

(async()=>{
  const{data,error}=await supabase.from('content_translations_eav').select('content_hash,field,locale,value');
  if(error){console.log('Error:',error.message);return;}
  console.log('Total EAV rows:',data.length);
  const ar=data.filter(r=>r.locale==='ar');
  console.log('AR rows:',ar.length);

  function baseHash(h){ return h.split(':').slice(0,-1).join(':'); }
  function fieldName(h){ return h.split(':').pop(); }

  const byBase={};
  for(const r of ar){
    const b=baseHash(r.content_hash);
    if(!byBase[b]) byBase[b]={base:b,fields:[],rowId:r.content_hash.substring(0,40)};
    byBase[b].fields.push({field:r.field,value:(r.value||'').substring(0,50)});
  }
  const entries=Object.values(byBase);
  console.log('\nUnique AR content groups:',entries.length);

  entries.sort((a,b)=>b.fields.length-a.fields.length);
  const layouts={};
  for(const e of entries){
    const sig=e.fields.map(f=>f.field).sort().join('|');
    if(!layouts[sig]) layouts[sig]={fields:e.fields.map(f=>f.field).sort(),count:0,examples:[]};
    layouts[sig].count++;
    if(layouts[sig].examples.length<2) layouts[sig].examples.push(e.rowId);
  }

  console.log('\n=== LAYOUTS ('+Object.keys(layouts).length+') ===');
  const sorted=Object.entries(layouts).sort((a,b)=>b[1].count-a[1].count);
  for(const[sig,info]of sorted){
    console.log(info.count+' entities | '+info.fields.length+' fields | '+info.fields.join(', '));
  }

  console.log('\n=== ALL AR ROWS (sorted by field count) ===');
  for(const e of entries){
    const fields=e.fields.map(f=>f.field).sort().join(', ');
    console.log((e.rowId||'').substring(0,35),' | fields:',e.fields.length,' |',fields);
  }
})();