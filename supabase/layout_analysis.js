require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

(async()=>{
  try{
  const{data,error}=await supabase.from('content_translations_eav').select('content_hash,field,locale,value,table_name,row_id');
  if(error)throw error;
  console.log('Total AR EAV rows:',data.length);

  const byHash={};
  for(const r of data){
    if(!byHash[r.content_hash]) byHash[r.content_hash]={hash:r.content_hash.substring(0,25),fields:[],table:r.table_name,rowId:r.row_id.substring(0,8),val:{}};
    byHash[r.content_hash].fields.push(r.field);
    byHash[r.content_hash].table=r.table_name;
    byHash[r.content_hash].rowId=r.row_id.substring(0,8);
    byHash[r.content_hash].val[r.field]=(r.value||'').substring(0,60);
  }

  const entries=Object.values(byHash);
  console.log('Unique EAV content IDs:',entries.length);

  const layouts={};
  for(const e of entries){
    const f=e.fields.slice().sort().join('||');
    if(!layouts[f]) layouts[f]={fields:e.fields.slice().sort(),count:0,examples:[]};
    layouts[f].count++;
    if(layouts[f].examples.length<3) layouts[f].examples.push(e.rowId+' ('+e.table+')');
  }

  console.log('\n=== LAYOUTS ===');
  const sorted=Object.entries(layouts).sort((a,b)=>b[1].count-a[1].count);
  for(const[fieldsStr,info]of sorted){
    console.log(info.count+' rows | '+info.fields.length+' fields: '+info.fields.join(', '));
    console.log('  examples:',info.examples.join(', '));
  }

  console.log('\n=== TOUR LAYOUTS ONLY ===');
  const tourEntries=entries.filter(e=>e.table==='tours');
  console.log('Tour EAV IDs:',tourEntries.length);
  const tourLayouts={};
  for(const e of tourEntries){
    const f=e.fields.slice().sort().join('||');
    if(!tourLayouts[f]) tourLayouts[f]={fields:e.fields.slice().sort(),count:0,examples:[]};
    tourLayouts[f].count++;
    if(tourLayouts[f].examples.length<3) tourLayouts[f].examples.push(e.rowId);
  }
  for(const[fieldsStr,info]of Object.entries(tourLayouts).sort((a,b)=>b[1].count-a[1].count)){
    console.log(info.count+' tours | '+info.fields.length+' fields: '+info.fields.join(', '));
    console.log('  examples:',info.examples.join(', '));
  }
  }catch(e){console.log('Caught:',e.message,e.stack);}
})();
