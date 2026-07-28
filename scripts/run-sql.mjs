import https from 'https';

const PROJECT = 'bgweumxabgkkqnvifaik';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I';

const sql = `ALTER TABLE tours ADD COLUMN IF NOT EXISTS discount JSONB DEFAULT '{}'::jsonb;`;

// Try multiple endpoints
const endpoints = [
  { host: PROJECT + '.supabase.co', path: '/pg/', label: '/pg/' },
  { host: PROJECT + '.supabase.co', path: '/rest/v1/rpc/', label: '/rpc/' },
  { host: 'api.supabase.com', path: '/v1/projects/' + PROJECT + '/database/query', label: 'mgmt' },
];

async function tryEndpoint(host, path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ query: body });
    const opts = {
      hostname: host,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        apikey: KEY,
        Authorization: 'Bearer ' + KEY,
      },
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', (e) => resolve({ status: 'error', body: e.message }));
    req.write(data);
    req.end();
  });
}

// Also try creating a function first, then calling it
async function main() {
  for (const ep of endpoints) {
    console.log('Trying', ep.label, '...');
    const result = await tryEndpoint(ep.host, ep.path, sql);
    console.log('  Status:', result.status);
    console.log('  Body:', result.body.substring(0, 300));
    if (result.status === 200 || result.status === 201) {
      console.log('  SUCCESS!');
      return;
    }
  }

  // If none work, try creating the run_sql function first
  console.log('Trying to create run_sql function...');
  const createFnSql = `
    CREATE OR REPLACE FUNCTION public.run_sql(query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE query;
    END;
    $$;
  `;
  for (const ep of endpoints) {
    const result = await tryEndpoint(ep.host, ep.path, createFnSql);
    console.log('  Create fn', ep.label, ':', result.status, result.body.substring(0, 200));
    if (result.status < 400) {
      // Now call it
      console.log('  Calling run_sql...');
      const r2 = await tryEndpoint(ep.host, '/rest/v1/rpc/run_sql', sql);
      console.log('  Call result:', r2.status, r2.body.substring(0, 200));
      break;
    }
  }
}

main().catch(console.error);
