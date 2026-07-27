require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const fs=require('fs');
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

(async()=>{
  const ct_eav=await supabase.from('content_translations_eav').select('content_hash,field,value,locale');
  const eav=ct_eav.data.filter(r=>r.locale==='ar');

  function baseHash(h){return h.split(':').slice(0,-1).join(':');}
  function fieldOf(h){return h.split(':').pop();}

  const byHash={};
  for(const r of eav){
    const b=baseHash(r.content_hash);
    if(!byHash[b])byHash[b]={hash:b.substring(0,20),fields:{}};
    byHash[b].fields[r.field]=r.value;
  }

  const ct=await supabase.from('content_translations').select('row_id,table_name,name,short_description,category_label,meeting_point,duration,description,highlights,included,not_included,faqs,locale');
  const arTours=(ct.data||[]).filter(r=>r.locale==='ar'&&r.table_name==='tours');

  const fieldMap={
    name:'name',
    shortDescription:'short_description',
    description:'description',
    categoryLabel:'category_label',
    duration:'duration',
    meetingPoint:'meeting_point',
    highlights:'highlights',
    included:'included',
    notIncluded:'not_included',
    faqQ:'faqs.questions',
    faqA:'faqs.answers'
  };

  const allFields=['name','shortDescription','description','categoryLabel','duration','meetingPoint','highlights','included','notIncluded','faqQ','faqA'];

  console.log('=== EAV TO CONTENT_TRANSLATIONS MAPPING ===');
  console.log('EAV field -> DB column');
  for(const[from,to]of Object.entries(fieldMap)){
    console.log('  '+from+' -> '+to);
  }

  console.log('\n=== LAYOUT TABLE: All AR Tours ===');
  console.log('Row Hash(20) | Fields Present | name|sd|desc|cat|dur|mp|high|inc|excl|faqQ|faqA');
  for(const[id,grp]of Object.entries(byHash)){
    const sig=allFields.map(f=>grp.fields[f]?'✓':'✗').join('|');
    console.log(grp.hash.substring(0,20)+' | '+Object.keys(grp.fields).length+' fields | '+sig);
  }

  console.log('\n=== SYMPTOM ANALYSIS ===');
  console.log('The AR content_translations currently in DB was populated by migration 003 using positional INDEX mapping.');
  console.log('But the EAV table has 23 different field layouts (different optional fields per tour).');
  console.log('Positional mapping causes fields to land in WRONG columns when layout differs from the reference.');
  console.log('');

  const hashKeys=Object.keys(byHash);
  let problemCount=0;
  for(const hash of hashKeys){
    const grp=byHash[hash];
    const eavFields=Object.keys(grp.fields).sort();
    if(eavFields.length<=1)continue;

    const hasName=eavFields.includes('name');
    const hasShort=eavFields.includes('shortDescription');
    const hasDesc=eavFields.includes('description');
    const hasCat=eavFields.includes('categoryLabel');
    const hasDur=eavFields.includes('duration');
    const hasMP=eavFields.includes('meetingPoint');
    const hasHigh=eavFields.includes('highlights');
    const hasInc=eavFields.includes('included');
    const hasExcl=eavFields.includes('notIncluded');

    const missingFields=[];
    if(!hasName)missingFields.push('name');
    if(!hasShort)missingFields.push('shortDescription');
    if(!hasDesc)missingFields.push('description');
    if(!hasCat)missingFields.push('categoryLabel');
    if(!hasDur)missingFields.push('duration');
    if(!hasMP)missingFields.push('meetingPoint');

    if(missingFields.length>0){
      problemCount++;
      console.log('HASH('+grp.hash+') is missing: '+missingFields.join(', ')+' (has '+eavFields.length+' fields)');
      console.log('  Present fields:',eavFields.join(', '));
    }
  }
  console.log('\nTours with missing optional fields:',problemCount,'/',hashKeys.length);
})();