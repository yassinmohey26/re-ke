require('dotenv').config();
const { Client } = require('pg');
async function t() {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const r = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='featured'");
  console.log('featured exists:', r.rows.length > 0);
  await c.end();
}
t().catch(e => console.error(e));
