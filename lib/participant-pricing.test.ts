import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateParticipantPrice } from './participant-pricing';

const prices = {
  adult: { personType: 'adult' as const, price: 50, currency: 'EUR', minAge: 12, maxAge: 120, isActive: true },
  child: { personType: 'child' as const, price: 25, currency: 'EUR', minAge: 3, maxAge: 11, isActive: true },
  infant: { personType: 'infant' as const, price: 0, currency: 'EUR', minAge: 0, maxAge: 2, isActive: true },
};

test('calculates participant prices, free infant, and extras', () => {
  const result = calculateParticipantPrice({
    prices,
    quantities: { adult: 2, child: 1, infant: 1 },
    extras: [{ id: 'transfer', name: 'Transfer', price: 5 }],
  });
  assert.equal(result.participantSubtotal, 125);
  assert.equal(result.extrasSubtotal, 15);
  assert.equal(result.subtotal, 140);
  assert.equal(result.lines.find((line) => line.personType === 'infant')?.unitPrice, 0);
});

test('supports decimal prices', () => {
  const result = calculateParticipantPrice({
    prices: { ...prices, adult: { ...prices.adult, price: 19.95 } },
    quantities: { adult: 2, child: 0, infant: 0 },
  });
  assert.equal(result.subtotal, 39.9);
});
