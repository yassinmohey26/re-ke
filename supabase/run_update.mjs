import {createClient} from '@supabase/supabase-js';
import {readFile} from 'fs/promises';

const sb = createClient("https://bgweumxabgkkqnvifaik.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I");

const updates = await import('./fr_blog_updates.json', {with: {type: 'json'}});

(async()=>{
  for(const u of updates.default){
    const {error} = await sb.from('content_translations').upsert({
      table_name: 'blog_posts',
      row_id: u.row_id,
      locale: u.locale,
      name: u.name,
      title: u.title,
      excerpt: u.excerpt,
      content: u.content
    }, {onConflict: 'table_name,row_id,locale'});
    if (error) console.log(u.row_id.substring(0,12), 'ERROR:', error.message);
    else console.log(u.row_id.substring(0,12), 'UPDATED');
  }
})();