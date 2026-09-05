import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CheckoutPricingError,
  resolveServerCheckout,
  sanitizeExtraIds,
  validateExtraSelection,
  validateParticipantQuantities,
} from './checkout-pricing';
import { calculateDepositAmount, toStripeCents } from './participant-pricing';

// Server-loaded database rows (shapes returned by Supabase for this tour).
const tour = { price: 100, max_guests: 8 };
const participantRows = [
  { person_type: 'adult', price: 50, currency: 'EUR', min_age: 12, max_age: 120, is_active: true },
  { person_type: 'child', price: 25, currency: 'EUR', min_age: 3, max_age: 11, is_active: true },
  { person_type: 'infant', price: 0, currency: 'EUR', min_age: 0, max_age: 2, is_active: true },
];
// Active extras approved by the database FOR THIS TOUR. An extra belonging to
// a different tour is never present in this list.
const approvedExtras = [
  { id: 'extra-1', name: 'Hotel Transfer', price: 15 },
  { id: 'extra-2', name: 'Lunch', price: 9.5 },
];

const baseArgs = {
  tour,
  participantRows,
  quantities: { adult: 2, child: 1, infant: 1 },
  requestedExtraIds: ['extra-1'],
  approvedExtras,
};

test('server total includes participant prices and approved extras', () => {
  const { calculation, guests, legacyFallback } = resolveServerCheckout(baseArgs);
  assert.equal(guests, 4);
  assert.equal(legacyFallback, false);
  assert.equal(calculation.participantSubtotal, 125); // 2×50 + 1×25 + 1×0
  assert.equal(calculation.extrasSubtotal, 45); // 15 × 3 paying guests (infants excluded)
  assert.equal(calculation.subtotal, 170);
});

test('free infants contribute nothing to the total', () => {
  const { calculation } = resolveServerCheckout({
    ...baseArgs,
    quantities: { adult: 1, child: 0, infant: 3 },
    requestedExtraIds: [],
  });
  const infantLine = calculation.lines.find((line) => line.personType === 'infant');
  assert.equal(infantLine?.unitPrice, 0);
  assert.equal(infantLine?.subtotal, 0);
  assert.equal(calculation.subtotal, 50);
  assert.equal(calculation.extrasSubtotal, 0);
});

test('a tampered client total can never influence the result', () => {
  // The client claims a 1 € total; resolveServerCheckout has no total input,
  // so the extra property is ignored and the DB-derived total wins.
  const tampered = { ...baseArgs, totalPrice: 1 };
  const honest = resolveServerCheckout(baseArgs);
  const attacked = resolveServerCheckout(tampered);
  assert.equal(attacked.calculation.subtotal, honest.calculation.subtotal);
  assert.equal(attacked.calculation.subtotal, 170);
});

test('tampered extra prices are ignored — database price wins', () => {
  // Even if the browser claimed extra-1 costs 0.01 €, only the approved DB
  // rows enter the calculation.
  const { calculation } = resolveServerCheckout({
    ...baseArgs,
    quantities: { adult: 1, child: 0, infant: 0 },
  });
  const extra = calculation.extras.find((e) => e.id === 'extra-1');
  assert.equal(extra?.unitPrice, 15);
  assert.equal(extra?.quantity, 1);
  assert.equal(extra?.subtotal, 15);
  assert.equal(calculation.extrasSubtotal, 15);
});

test('unauthorized extra ID is rejected', () => {
  assert.throws(
    () => resolveServerCheckout({ ...baseArgs, requestedExtraIds: ['forged-id'] }),
    (error: unknown) => error instanceof CheckoutPricingError && error.message === 'Invalid extra selected'
  );
});

test('extra belonging to another tour is rejected', () => {
  // 'extra-other-tour' exists in tour_extras but was not returned for THIS
  // tour (the query filters by tour_id), so it must be rejected.
  assert.throws(
    () => resolveServerCheckout({ ...baseArgs, requestedExtraIds: ['extra-other-tour'] }),
    CheckoutPricingError
  );
  assert.throws(
    () => validateExtraSelection(['extra-other-tour'], approvedExtras),
    CheckoutPricingError
  );
});

test('duplicate extra IDs are rejected', () => {
  assert.throws(
    () => validateExtraSelection(['extra-1', 'extra-1'], approvedExtras),
    (error: unknown) => error instanceof CheckoutPricingError && error.message === 'Duplicate extras are not allowed'
  );
});

test('inactive extra is rejected (absent from approved rows)', () => {
  assert.throws(
    () => validateExtraSelection(['inactive-extra'], approvedExtras),
    CheckoutPricingError
  );
});

test('display-only participant rows (_adults etc.) are stripped', () => {
  assert.deepEqual(
    sanitizeExtraIds(['extra-1', '_adults', '_children', '_infants', '']),
    ['extra-1']
  );
});

test('missing configured participant price is rejected', () => {
  // Structured prices exist but child is not configured while children > 0.
  const rowsWithoutChild = participantRows.filter((row) => row.person_type !== 'child');
  assert.throws(
    () => resolveServerCheckout({ ...baseArgs, participantRows: rowsWithoutChild }),
    (error: unknown) => error instanceof CheckoutPricingError && error.message === 'Configured participant price is missing'
  );
});

test('legacy fallback: tour.price for adults, half for children, infants free', () => {
  const { calculation, legacyFallback } = resolveServerCheckout({
    ...baseArgs,
    participantRows: [],
    requestedExtraIds: [],
  });
  assert.equal(legacyFallback, true);
  assert.equal(calculation.participantSubtotal, 250); // 2×100 + 1×50 + 1×0
  assert.equal(calculation.subtotal, 250);
});

test('quantity rules: at least one adult, max guests, integers only', () => {
  assert.throws(
    () => validateParticipantQuantities({ adult: 0, child: 2, infant: 0 }, 8),
    (error: unknown) => error instanceof CheckoutPricingError && error.message === 'At least one adult is required'
  );
  assert.throws(() => validateParticipantQuantities({ adult: 5, child: 3, infant: 2 }, 8), CheckoutPricingError);
  assert.throws(() => validateParticipantQuantities({ adult: -1, child: 0, infant: 0 }, 8), CheckoutPricingError);
  assert.throws(() => validateParticipantQuantities({ adult: 1.5, child: 0, infant: 0 } as never, 8), CheckoutPricingError);
  assert.equal(validateParticipantQuantities({ adult: 6, child: 1, infant: 1 }, 8), 8);
  assert.equal(validateParticipantQuantities({ adult: 1, child: 0, infant: 0 }, null), 1); // default max
});

test('deposit is a rounded 30% of the server total', () => {
  assert.equal(calculateDepositAmount(170), 51);
  assert.equal(calculateDepositAmount(100), 30);
  assert.equal(calculateDepositAmount(19.99), 6); // 5.997 → 6.00
  assert.equal(toStripeCents(calculateDepositAmount(170)), 5100);
});

test('decimal prices round correctly to Stripe cents', () => {
  const decimalRows = [
    { person_type: 'adult', price: 19.95, currency: 'EUR', min_age: 12, max_age: 120, is_active: true },
    { person_type: 'child', price: 9.99, currency: 'EUR', min_age: 3, max_age: 11, is_active: true },
    { person_type: 'infant', price: 0, currency: 'EUR', min_age: 0, max_age: 2, is_active: true },
  ];
  const { calculation } = resolveServerCheckout({
    ...baseArgs,
    participantRows: decimalRows,
    requestedExtraIds: ['extra-2'], // 9.50 × 3 paying guests = 28.5
  });
  assert.equal(calculation.participantSubtotal, 49.89); // 2×19.95 + 9.99
  assert.equal(calculation.extrasSubtotal, 28.5);
  assert.equal(calculation.subtotal, 78.39);
  assert.equal(toStripeCents(calculation.subtotal), 7839);
  assert.equal(toStripeCents(19.99), 1999);
  assert.equal(toStripeCents(0.1 + 0.2), 30); // floating-point safe rounding
});
