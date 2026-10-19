// Isolated, in-memory PostgreSQL only. Never reads environment credentials.
// Test dependency: npm install --prefix node_modules/.cache/reviews-validation --no-save --package-lock=false --ignore-scripts @electric-sql/pglite
// Run: node --test scripts/reviews-migration.test.cjs
const { PGlite } = require('../node_modules/.cache/reviews-validation/node_modules/@electric-sql/pglite');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const assert = require('node:assert/strict');
const test = require('node:test');

test('review migration and transactional saves in isolated PostgreSQL', async t => {
  const db = new PGlite();
  const a = '11111111-1111-4111-8111-111111111111';
  const b = '22222222-2222-4222-8222-222222222222';
  const missing = '33333333-3333-4333-8333-333333333333';
  const old = '44444444-4444-4444-8444-444444444444';
  const migration = name => readFileSync(resolve(__dirname, '../supabase/migrations', name), 'utf8');
  const input = (type = 'tour', extra = {}) => ({
    review_type: type, guest_name: 'Synthetic test guest', guest_country: '', country_code: '',
    guest_image: '', travel_date: null, rating: 5, translations: { en: { title: '', body: 'Synthetic review' } },
    is_verified: false, is_published: true, featured: true, sort_order: 1, ...extra,
  });
  const save = async (id, row, tours) => (await db.query(
    'SELECT public.save_review_with_tours($1::uuid, $2::jsonb, $3::uuid[]) AS review',
    [id, JSON.stringify(row), tours],
  )).rows[0].review;
  try {
    await db.exec('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE TABLE public.tours(id UUID PRIMARY KEY);');
    await db.exec(migration('012_tour_reviews.sql'));
    await db.query('INSERT INTO tours VALUES ($1), ($2)', [a, b]);
    await db.query(`INSERT INTO reviews(id, tour_id, guest_name, rating, translations, sort_order)
      VALUES ($1, $2, 'Existing synthetic guest', 4, '{"en":{"body":"Existing review"}}', 1)`, [old, a]);
    const before = (await db.query('SELECT * FROM reviews')).rows[0];
    await db.exec(migration('013_review_scopes.sql'));

    await t.test('migration preserves every existing field and backfills the association', async () => {
      const after = (await db.query('SELECT * FROM reviews WHERE id = $1', [old])).rows[0];
      const { review_type, ...originalFields } = after;
      assert.equal(review_type, 'tour');
      assert.deepEqual(originalFields, before);
      assert.deepEqual((await db.query('SELECT review_id, tour_id FROM review_tours')).rows, [{ review_id: old, tour_id: a }]);
    });

    let multi;
    await t.test('one review links to multiple tours without duplicates', async () => {
      multi = await save(null, input(), [a, b, a]);
      assert.equal(multi.tour_id, a);
      assert.equal((await db.query('SELECT * FROM review_tours WHERE review_id=$1', [multi.id])).rows.length, 2);
    });
    await t.test('company and transfer reviews save without tours', async () => {
      for (const type of ['company', 'transfer']) {
        const row = await save(null, input(type), []);
        assert.equal(row.tour_id, null);
        assert.equal(row.review_type, type);
        assert.equal((await db.query('SELECT * FROM review_tours WHERE review_id=$1', [row.id])).rows.length, 0);
      }
    });
    await t.test('a failed edit preserves content, associations and ordering', async () => {
      const beforeRows = (await db.query('SELECT * FROM reviews ORDER BY id')).rows;
      const beforeLinks = (await db.query('SELECT * FROM review_tours ORDER BY review_id, tour_id')).rows;
      await assert.rejects(save(multi.id, input('tour', { guest_name: 'Must roll back' }), [a, missing]));
      await assert.rejects(save(multi.id, input('tour', { rating: 9 }), [b]));
      assert.deepEqual((await db.query('SELECT * FROM reviews ORDER BY id')).rows, beforeRows);
      assert.deepEqual((await db.query('SELECT * FROM review_tours ORDER BY review_id, tour_id')).rows, beforeLinks);
    });
    await t.test('editing links and switching scope removes stale associations', async () => {
      await save(multi.id, input(), [b]);
      assert.deepEqual((await db.query('SELECT tour_id FROM review_tours WHERE review_id=$1', [multi.id])).rows, [{ tour_id: b }]);
      await save(multi.id, input('transfer'), []);
      assert.equal((await db.query('SELECT * FROM review_tours WHERE review_id=$1', [multi.id])).rows.length, 0);
      await save(multi.id, input(), [a, b]);
    });
    await t.test('deleting one tour preserves the review and its other tour', async () => {
      await db.query('DELETE FROM tours WHERE id=$1', [a]);
      assert.equal((await db.query('SELECT tour_id FROM reviews WHERE id=$1', [multi.id])).rows[0].tour_id, null);
      assert.deepEqual((await db.query('SELECT tour_id FROM review_tours WHERE review_id=$1', [multi.id])).rows, [{ tour_id: b }]);
    });
    await t.test('invalid scopes, empty tours, unknown edits and empty text are rejected', async () => {
      await assert.rejects(save(null, input('tour'), []));
      await assert.rejects(save(null, input('company'), [b]));
      await assert.rejects(save(null, input('invalid'), []));
      await assert.rejects(save(missing, input(), [b]), /Review not found/);
      await assert.rejects(save(null, input('company', { translations: {} }), []));
    });
    await t.test('requested order is applied and positions remain contiguous', async () => {
      await save(multi.id, input('tour', { sort_order: 2 }), [b]);
      const rows = (await db.query('SELECT id, sort_order FROM reviews ORDER BY sort_order')).rows;
      assert.equal(rows[1].id, multi.id);
      assert.deepEqual(rows.map(r => r.sort_order), rows.map((_, i) => i + 1));
    });
    await t.test('public roles cannot call the write function or read associations', async () => {
      for (const role of ['anon', 'authenticated']) {
        const permissions = (await db.query(`SELECT
          has_function_privilege($1, 'public.save_review_with_tours(uuid,jsonb,uuid[])', 'EXECUTE') AS can_save,
          has_table_privilege($1, 'public.review_tours', 'SELECT') AS can_read`, [role])).rows[0];
        assert.deepEqual(permissions, { can_save: false, can_read: false });
      }
      assert.equal((await db.query("SELECT has_function_privilege('service_role', 'public.save_review_with_tours(uuid,jsonb,uuid[])', 'EXECUTE') AS allowed")).rows[0].allowed, true);
    });
  } finally {
    await db.close();
  }
});
