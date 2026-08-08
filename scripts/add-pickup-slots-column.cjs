// Migration: Add pickup_time_slots JSONB column to tours table
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

(async () => {
  const client = await pool.connect();
  try {
    console.log('Adding pickup_time_slots column...');
    await client.query(`ALTER TABLE tours ADD COLUMN IF NOT EXISTS pickup_time_slots JSONB DEFAULT '[]'::jsonb`);
    
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tours' AND column_name = 'pickup_time_slots'
    `);
    
    if (res.rows.length > 0) {
      console.log('✅ Column pickup_time_slots added successfully:', res.rows[0]);
    } else {
      console.error('❌ Column not found after ALTER TABLE.');
      process.exit(1);
    }
  } finally {
    client.release();
    await pool.end();
  }
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
