require('dotenv').config({path: require('path').join(__dirname, '..', '.env.local')});
const {createClient}=require('@supabase/supabase-js');
const fs=require('fs');
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

(async()=>{
  const{data,error}=await supabase.from('content_translations_eav').select('*');
  if(error){console.log('Error:',error.message);return}
  console.log('EAV total rows:',data.length);
  console.log('EAV columns:',Object.keys(data[0]));

  const tours=data.filter(r=>r.table_name==='tours');
  console.log('Tour EAV rows:',tours.length);

  const byRow={};
  for(const r of tours){
    if(!byRow[r.row_id])byRow[r.row_id]=[];
    byRow[r.row_id].push(r);
  }
  console.log('Unique tour IDs:',Object.keys(byRow).length);

  const ids=Object.keys(byRow);
  const summary=ids.map(id=>{
    const rows=byRow[id];
    const fields=rows.map(r=>r.field_name).sort();
    return{id:id.substring(0,8),fields,count:rows.length};
  });
  fs.writeFileSync('eav_tour_layouts.json',JSON.stringify(summary,null,2));
  console.log('Saved eav_tour_layouts.json');

  console.log('\n=== Sample: first 5 tour layouts ===');
  for(let i=0;i<5;i++){
    const s=summary[i];
    console.log('ID:',s.id,'Fields:',s.count,'->',s.fields.join(', '));
  }
})();
