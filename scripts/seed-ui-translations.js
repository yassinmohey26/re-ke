const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgweumxabgkkqnvifaik.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOCALES = ['de', 'en', 'ru'];

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

async function seed() {
  const messagesDir = path.join(__dirname, '..', 'messages');
  const rows = [];

  for (const locale of LOCALES) {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Missing: ${filePath}`);
      continue;
    }
    const messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const [namespace, keys] of Object.entries(messages)) {
      const flat = flattenObject(keys);
      for (const [key, value] of Object.entries(flat)) {
        rows.push({
          locale,
          namespace,
          key,
          value,
        });
      }
    }
  }

  console.log(`Seeding ${rows.length} translation rows...`);

  // Upsert in batches of 100
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await supabase
      .from('ui_translations')
      .upsert(batch, { onConflict: 'locale,namespace,key' });

    if (error) {
      console.error('Batch error:', error.message);
    } else {
      console.log(`  Upserted ${Math.min(i + 100, rows.length)} / ${rows.length}`);
    }
  }

  // Bump version
  await supabase.rpc('increment_ui_translations_version').catch(() => {
    // RPC may not exist, manually update
    return supabase.from('ui_translations_version').update({ version: Date.now(), updated_at: new Date().toISOString() }).eq('id', 1);
  });

  console.log('Done!');
}

seed().catch(console.error);
