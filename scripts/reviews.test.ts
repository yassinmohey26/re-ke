import assert from 'node:assert/strict';
import test from 'node:test';
import type { SupabaseClient } from '@supabase/supabase-js';
import { sanitizeReviewInput, reviewTourIds, resolveReviewTranslation } from '../lib/reviews';
import { loadReviewRows } from '../lib/data/review-rows';

const tourA = '11111111-1111-4111-8111-111111111111';
const tourB = '22222222-2222-4222-8222-222222222222';
const base = { guestName: 'Test guest', rating: 5, translations: { en: { body: 'Test experience', title: '' } } };

test('company and transfer reviews need no tour, and discard previous tour links', () => {
  for (const reviewType of ['company', 'transfer']) {
    for (const tourIds of [[], [tourA]]) {
      const result = sanitizeReviewInput({ ...base, reviewType, tourIds });
      assert.ok(result.row);
      assert.equal(result.row.review_type, reviewType);
      assert.equal(result.row.tour_id, null);
      assert.deepEqual(result.tourIds, []);
    }
  }
});

test('multi-tour input is deduplicated and legacy single-tour input remains valid', () => {
  const result = sanitizeReviewInput({ ...base, reviewType: 'tour', tourIds: [tourA, tourB, tourA] });
  assert.ok(result.row);
  assert.deepEqual(result.tourIds, [tourA, tourB]);
  assert.equal(result.row.tour_id, tourA);
  assert.equal(sanitizeReviewInput({ ...base, tourId: tourA }).row?.tour_id, tourA);
});

test('invalid types, missing tours, invalid IDs, ratings and empty text are rejected', () => {
  for (const extra of [
    { reviewType: 'other' }, { reviewType: 'tour', tourIds: [] },
    { reviewType: 'tour', tourIds: ['bad'] }, { reviewType: 'tour', tourIds: 'bad' },
    { rating: 0 }, { rating: 6 }, { rating: 3.5 }, { guestName: ' ' },
    { translations: { en: { title: 'Only title', body: ' ' } } },
  ]) assert.ok(sanitizeReviewInput({ ...base, reviewType: 'company', ...extra }).error);
});

test('tour associations include legacy and multiple links once, and exclude unrelated scopes', () => {
  const row = { tour_id: tourA, review_tours: [{ tour_id: tourA }, { tour_id: tourB }] };
  assert.deepEqual(reviewTourIds(row), [tourA, tourB]);
  assert.deepEqual(reviewTourIds({ ...row, review_type: 'company' }), []);
  assert.deepEqual(reviewTourIds({ ...row, review_type: 'transfer' }), []);
  assert.deepEqual(reviewTourIds({ tour_id: null, review_tours: [{ tour_id: tourB }] }), [tourB]);
});

test('one available language can display in all locales without fabricating translations', () => {
  for (const locale of ['de', 'en', 'fr', 'hu', 'ru', 'ar']) {
    assert.equal(resolveReviewTranslation(base.translations, locale)?.body, 'Test experience');
  }
  assert.equal(resolveReviewTranslation({ en: { body: ' ' } }, 'en'), null);
});

function fakeDb(rows: Record<string, unknown>[], missingRelation = false, failSecondPage = false) {
  const selections: string[] = [];
  const db = {
    from: () => {
      let selection = '';
      let from = 0;
      let to = 0;
      const filters: [string, unknown][] = [];
      const query = {
        select(value: string) { selection = value; selections.push(value); return query; },
        order() { return query; },
        range(start: number, end: number) { from = start; to = end; return query; },
        eq(key: string, value: unknown) { filters.push([key, value]); return query; },
        then(resolve: (value: unknown) => unknown) {
          if (missingRelation && selection !== '*') return Promise.resolve(resolve({ error: { code: 'PGRST200', message: 'Missing relation' } }));
          if (failSecondPage && from > 0) return Promise.resolve(resolve({ error: { code: 'OTHER', message: 'Network error' } }));
          return Promise.resolve(resolve({ data: rows.filter(row => filters.every(([key, value]) => row[key] === value)).slice(from, to + 1), error: null }));
        },
      };
      return query;
    },
  } as unknown as SupabaseClient;
  return { db, selections };
}

test('homepage reads every featured published review beyond both four and the database page limit', async () => {
  const rows = Array.from({ length: 1007 }, (_, id) => ({ id, featured: true, is_published: true }));
  rows.push({ id: 1007, featured: true, is_published: false }, { id: 1008, featured: false, is_published: true });
  const { db } = fakeDb(rows);
  const found = await loadReviewRows(db, { published: true, featured: true });
  assert.equal(found.length, 1007);
  assert.equal(new Set(found.map(row => row.id)).size, 1007);
});

test('read-only rollout compatibility retains legacy reviews when relation is not installed', async () => {
  const { db, selections } = fakeDb([{ tour_id: tourA }], true);
  assert.deepEqual(await loadReviewRows(db), [{ tour_id: tourA }]);
  assert.deepEqual(selections, ['*, review_tours(tour_id)', '*']);
});

test('database errors do not silently turn a partial review list into a success', async () => {
  const { db } = fakeDb(Array.from({ length: 501 }, (_, id) => ({ id })), false, true);
  await assert.rejects(loadReviewRows(db), /Network error/);
});
