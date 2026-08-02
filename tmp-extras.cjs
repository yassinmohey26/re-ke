const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const t = fs.readFileSync('.env.local', 'utf8');
const url = t.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)/)[1];
const key = t.match(/SUPABASE_SERVICE_ROLE_KEY="([^"]+)/)[1];
const sb = createClient(url, key);

(async () => {
  const tr = await sb.from('tours').select('slug,price').eq('id', '77f34e21-9d9d-4be6-90b3-8148b2d82214').single();
  console.log('tour 77f34e21:', JSON.stringify(tr.data), 'err:', tr.error && tr.error.message);
})();
