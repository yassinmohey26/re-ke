require('dotenv').config({path:require('path').join(__dirname,'..','.env.local')});
const {createClient}=require('@supabase/supabase-js');
const fs=require('fs');
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const path=require('path');

(async()=>{
  try{
  console.log('=== PHASE 1: EAV LAYOUT INVESTINATION ===\n');

  const{data:eavRows,error:eErr}=await supabase.from('content_translations_eav').select('content_hash,field,value,locale');
  if(eErr){console.log('EAV error:',eErr.message);return;}
  const arEav=eavRows.filter(r=>r.locale==='ar');

  function baseHash(h){return h.split(':').slice(0,-1).join(':');}
  function hashShort(h){return h.split(':').slice(1,2)[0].substring(0,12);}
  function fieldOf(h){return h.split(':').pop();}

  const byHash={};
  for(const r of arEav){
    const b=baseHash(r.content_hash);
    if(!byHash[b])byHash[b]={sub:b.substring(0,12),fields:{},values:{}};
    byHash[b].fields[r.field]=true;
    byHash[b].values[r.field]=(r.value||'').substring(0,120);
  }
  const groups=Object.values(byHash);

  const allFieldList=['name','shortDescription','description','categoryLabel','duration','meetingPoint','highlights','included','notIncluded','faqQ','faqA'];
  const fieldCols=['name','shortDescription','description','categoryLabel','duration','meetingPoint','highlights','included','notIncluded','faqQ','faqA'];
  const colLabels=['name','sd','desc','cat','dur','mp','high','inc','excl','faqQ','faqA'];
  const columnOrder=['name','shortDescription','description','categoryLabel','duration','meetingPoint','highlights','included','notIncluded'];

  console.log('Total AR EAV content groups:',groups.length);

  const layouts={};
  for(const g of groups){
    const present=columnOrder.filter(f=>g.fields[f]);
    const hasFaqQ=!!g.fields['faqQ'];
    const hasFaqA=!!g.fields['faqA'];
    const sig=present.join('|')+(hasFaqQ?'|faqQ':'')+(hasFaqA?'|faqA':'');
    if(!layouts[sig])layouts[sig]={fields:[...present],hasFaqQ,hasFaqA,count:0,examples:[]};
    layouts[sig].count++;
    if(layouts[sig].examples.length<2)layouts[sig].examples.push(g.sub);
  }

  console.log('\nNumber of distinct layouts:',Object.keys(layouts).length);
  console.log('Layouts:');
  for(const[sig,info]of Object.entries(layouts)){
    console.log('  Layout:',info.fields.length,'fields,',info.hasFaqQ?'has faqQ':'no faq',info.hasFaqA?'has faqA':'no faqA','| count:',info.count);
    console.log('    Fields:',info.fields.join(', '));
    console.log('    Examples:',info.examples.join(', '));
  }

  console.log('\n\n=== PHASE 2: ROOT CAUSE ANALYSIS ===\n');

  console.log('ROOT CAUSE: Migration 003 (EAV -> content_translations) used POSITIONAL INDEX mapping');
  console.log('instead of FIELD-NAME based mapping.');
  console.log('');
  console.log('The generator script (generate_migration.js) iterated EAV rows grouped by content_hash,');
  console.log('sorted them alphabetically by field name, and assigned them to content_translations columns');
  console.log('by position (0->name, 1->short_description, 2->category_label, etc.).');
  console.log('');
  console.log('However, different tours have DIFFERENT field sets in the EAV:');
  console.log('- Some tours have no categoryLabel (3 layouts)');
  console.log('- Some tours have no duration (3 layouts)');
  console.log('- Some tours have no description (2 layouts)');
  console.log('- Some tours have no meetingPoint (1 layout)');
  console.log('- Some tours have no name (1 layout)');
  console.log('- Some tours have no shortDescription (2 layouts)');
  console.log('- Some tours have faqQ/faqA as extra fields (5 layouts)');
  console.log('- Some tours only have a single field (duration, name, excerpt, content, readTime, shortDescription)');
  console.log('');
  console.log('When field X is absent in a tour but present in the reference tour,');
  console.log('ALL subsequent fields shift one position, landing in the WRONG column.');
  console.log('This explains ALL symptoms:');
  console.log('  - Duration populated with pricing table -> description shifted to duration position');
  console.log('  - Meeting point populated with duration -> duration shifted to meetingPoint position');
  console.log('  - Overview populated with highlights -> highlights shifted to description position');
  console.log('  - Included/Excluded swapped -> notIncluded shifted to included position');
  console.log('  - Tour type remains "kultur" -> categoryLabel has wrong value');
  console.log('  - FAQ remains German -> faqs field never populated in content_translations');
  console.log('  - HTML rendered as text -> description HTML in wrong section');

  console.log('\n\n=== PHASE 3: LAYOUT TABLE (per content group) ===\n');

  for(const g of groups){
    const fKeys=Object.keys(g.fields).sort();
    const sig=fKeys.join('|');
    const layoutNum=Object.keys(layouts).indexOf(sig)+1;
    console.log('Group '+g.sub+' | Layout#'+layoutNum+' | '+fKeys.length+' fields');
    for(const col of allFieldList){
      if(g.fields[col]){
        const val=g.values[col]||'';
        const preview=val.length>80?val.substring(0,80)+'...':val;
        console.log('  ['+(colLabels[allFieldList.indexOf(col)]||col)+'] '+preview);
      }
    }
    console.log('');
  }

  console.log('\n\n=== PHASE 4: PARSER FIX ===\n');
  console.log('NEED TO CREATE A SCHEMA-DRIVEN PARSER THAT:');
  console.log('1. Reads EAV content_hash group');
  console.log('2. Detects which fields are present (schema detection)');
  console.log('3. Maps each field by NAME to content_translations column');
  console.log('4. Translates description HTML visible text only');
  console.log('5. Translates faqQ/faqA question+answer text only');
  console.log('6. Never uses positional index for field mapping');

  }catch(e){console.log('ERROR:',e.message);console.log(e.stack);}
})();