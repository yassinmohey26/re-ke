const fs = require('fs');
const path = require('path');
const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(l => {
  const i = l.indexOf('=');
  if (i > 0 && !l.startsWith('#')) {
    env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  }
});
const { createClient } = require('@supabase/supabase-js');
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const slugs = [
    'glasbodenboot-hurghada-mit-schnorcheln',
    'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
    'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
    'kairo-mit-flug-ab-hurghada-pyramiden-museum',
    'mini-egypt-park-hurghada',
    'makadi-water-park-hurghada-mittagessen-transfer',
    'mahmya-insel-ausflug-hurghada',
    'orange-bay-insel-schnorchelausflug-hurghada'
  ];
  for (const slug of slugs) {
    const { data } = await db.from('tours').select('name, description, price').eq('slug', slug).single();
    if (!data) continue;
    console.log('\n=== ' + data.name + ' (base price: ' + data.price + ' EUR) ===');
    const tables = data.description.match(/<table[\s\S]*?<\/table>/gi) || [];
    tables.forEach((t, i) => {
      const plain = t.replace(/<tr>/gi, '\nROW ').replace(/<\/tr>/gi, '').replace(/<t[hd][^>]*>/gi, ' | ').replace(/<\/t[hd]>/gi, '').replace(/<[^>]+>/g, '').trim();
      console.log('Table ' + (i+1) + ':');
      console.log(plain);
    });
  }
})();
