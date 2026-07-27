require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const fs=require('fs');

(async()=>{
  const{data,error}=await supabase.from('content_translations_eav').select('content_hash,field,value,locale');
  if(error){console.log('Error:',error.message);return;}
  const ar=data.filter(r=>r.locale==='ar');

  function baseHash(h){ return h.split(':').slice(0,-1).join(':'); }

  const byBase={};
  for(const r of ar){
    const b=baseHash(r.content_hash);
    if(!byBase[b]) byBase[b]={hash:b,fields:{},rowId:r.content_hash.substring(0,40)};
    byBase[b].fields[r.field]=r.value;
  }

  const groups=Object.values(byBase);
  console.log('AR EAV groups:',groups.length);

  const layouts={};
  for(const g of groups){
    const f=Object.keys(g.fields).slice().sort().join('|');
    if(!layouts[f]) layouts[f]={fields:Object.keys(g.fields).sort(),count:0,groups:[]};
    layouts[f].count++;
    layouts[f].groups.push(g);
  }

  console.log('\n=== 23 LAYOUTS ===');
  const entries=Object.entries(layouts).sort((a,b)=>b[1].count-a[1].count);
  for(const[i,[fieldsStr,info]]of entries.entries()){
    console.log('\nLayout '+(i+1)+': '+info.fields.length+' fields ('+info.count+' entities)');
    console.log('  Fields:',info.fields.join(', '));
  }

  console.log('\n\n=== FULL CONTENT PER LAYOUT (first entity each) ===');
  for(const[i,[fieldsStr,info]]of entries.entries()){
    console.log('\n--- Layout '+(i+1)+' ('+info.fields.length+' fields, '+info.count+' entities) ---');
    const g=info.groups[0];
    for(const field of info.fields){
      const val=(g.fields[field]||'').substring(0,300);
      console.log('  '+field+': '+(val.length<300?val:val+'...[truncated]'));
    }
    console.log('  Hash: '+g.hash);
  }
})();