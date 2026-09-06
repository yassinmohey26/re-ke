import assert from 'node:assert/strict';
import test from 'node:test';
import { isValidBookingDate } from './validations';

const today = new Date(2026, 8, 6, 12, 0, 0);

test('accepts today and future booking dates', () => {
  assert.equal(isValidBookingDate('2026-09-06', today), true);
  assert.equal(isValidBookingDate('2026-09-15', today), true);
});

test('rejects past booking dates', () => {
  assert.equal(isValidBookingDate('2026-09-05', today), false);
});

test('rejects impossible and malformed dates', () => {
  assert.equal(isValidBookingDate('2026-02-30', today), false);
  assert.equal(isValidBookingDate('2026-13-01', today), false);
  assert.equal(isValidBookingDate('09/15/2026', today), false);
  assert.equal(isValidBookingDate('', today), false);
});

test('accepts valid leap days and rejects invalid leap days', () => {
  assert.equal(
    isValidBookingDate('2028-02-29', new Date(2028, 0, 1)),
    true
  );
  assert.equal(
    isValidBookingDate('2027-02-29', new Date(2027, 0, 1)),
    false
  );
});
