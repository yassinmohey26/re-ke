import https from 'https';

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I';

const sql = "ALTER TABLE tours ADD COLUMN IF NOT EXISTS discount JSONB DEFAULT '{}'::jsonb;";

const body = JSON.stringify({ query: sql });

const opts = {
  hostname: 'bgweumxabgkkqnvifaik.supabase.co',
  path: '/rest/v1/rpc/run_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
    Authorization: 'Bearer ' + SUPABASE_KEY,
  },
};

const req = https.request(opts, (res) => {
  let body = '';
  res.on('data', (c) => (body += c));
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    if (res.statusCode < 400) console.log('Column added successfully');
    else console.log('Error adding column');
  });
});
req.write(body);
req.end();
