const fs=require('fs');
const sql=fs.readFileSync('migrations/003v3_fix_ar_ru_content_translations_idempotent.sql','utf8');
const rows=sql.split('-- Row ');
for(const r of rows){
  if(r.includes('27ae0b35-e0e') && r.includes('tours') && r.includes("'ru'")){
    const lines=r.split('\n');
    for(const line of lines){
      if(line.includes('VALUES') || line.includes('faqs')){
        console.log(line.substring(0,400));
      }
    }
    break;
  }
}