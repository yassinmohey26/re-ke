require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();

  try {
    // Step 1: Check current state
    console.log('=== Step 1: Check current state ===');
    const { rows: tables } = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
      AND tablename IN ('content_translations', 'content_translations_eav_backup')
    `);
    console.log('Existing tables:', tables.map(r => r.tablename));

    const { rows: ctColumns } = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'content_translations' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    console.log('content_translations columns:', ctColumns.map(r => r.column_name));

    // Step 2: Rename old EAV table
    console.log('\n=== Step 2: Rename old EAV table ===');
    const hasCt = tables.some(r => r.tablename === 'content_translations');
    const hasBackup = tables.some(r => r.tablename === 'content_translations_eav_backup');
    
    if (hasCt && !hasBackup) {
      await client.query('ALTER TABLE content_translations RENAME TO content_translations_eav_backup');
      console.log('Renamed content_translations -> content_translations_eav_backup');
    } else if (hasBackup) {
      console.log('content_translations_eav_backup already exists, skipping rename');
    } else {
      console.log('No content_translations table found, skipping rename');
    }

    // Step 3: Create new table
    console.log('\n=== Step 3: Create new content_translations table ===');
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_translations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        table_name TEXT NOT NULL,
        row_id UUID NOT NULL,
        locale TEXT NOT NULL,
        name TEXT,
        short_description TEXT,
        description TEXT,
        category_label TEXT,
        highlights JSONB,
        included JSONB,
        not_included JSONB,
        itinerary JSONB,
        faqs JSONB,
        meeting_point TEXT,
        duration TEXT,
        tagline TEXT,
        title TEXT,
        excerpt TEXT,
        content TEXT,
        category TEXT,
        read_time TEXT,
        tags JSONB,
        question TEXT,
        answer TEXT,
        sort_order INTEGER,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(table_name, row_id, locale)
      );
    `);
    console.log('New content_translations table created');

    // Step 4: Create indexes
    console.log('\n=== Step 4: Create indexes ===');
    await client.query('CREATE INDEX IF NOT EXISTS idx_ct_table_row ON content_translations(table_name, row_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_ct_locale ON content_translations(locale)');
    console.log('Indexes created');

    // Verify new table structure
    const { rows: newCols } = await client.query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_name = 'content_translations' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    console.log('\nNew table columns:', newCols.map(r => r.column_name + '(' + r.data_type + ')'));

  } finally {
    client.release();
    await pool.end();
  }
})();
