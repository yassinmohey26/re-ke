import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateTransferSurcharge,
  isSupportedHotelRegion,
  TransferPricingError,
} from './transfer-pricing';
import { calculateDepositAmount, toStripeCents } from './participant-pricing';
import { resolveServerCheckout } from './checkout-pricing';

test('Hurghada has zero surcharge', () => {
  const result = calculateTransferSurcharge('hurghada', { adult: 2, child: 2, infant: 1 });
  assert.ok(result);
  assert.equal(result.unitPrice, 0);
  assert.equal(result.subtotal, 0);
});

test('Makadi Bay is €5 per paying guest', () => {
  const result = calculateTransferSurcharge('makadi-bay', { adult: 2, child: 1, infant: 1 });
  assert.ok(result);
  assert.equal(result.unitPrice, 5);
  assert.equal(result.quantity, 3);
  assert.equal(result.subtotal, 15);
});

test('El Gouna is €10 per paying guest', () => {
  const result = calculateTransferSurcharge('el-gouna', { adult: 2, child: 0, infant: 0 });
  assert.ok(result);
  assert.equal(result.unitPrice, 10);
  assert.equal(result.subtotal, 20);
});

test('El Quseir is €35 per paying guest', () => {
  const result = calculateTransferSurcharge('el-quseir', { adult: 1, child: 0, infant: 0 });
  assert.ok(result);
  assert.equal(result.unitPrice, 35);
  assert.equal(result.subtotal, 35);
});

test('Marsa Alam is €50 per paying guest', () => {
  const result = calculateTransferSurcharge('marsa-alam', { adult: 2, child: 2, infant: 0 });
  assert.ok(result);
  assert.equal(result.unitPrice, 50);
  assert.equal(result.quantity, 4);
  assert.equal(result.subtotal, 200);
});

test('infants are excluded from the surcharge quantity', () => {
  const result = calculateTransferSurcharge('marsa-alam', { adult: 1, child: 0, infant: 3 });
  assert.ok(result);
  assert.equal(result.quantity, 1);
  assert.equal(result.subtotal, 50);
});

test('unknown region is rejected', () => {
  assert.throws(
    () => calculateTransferSurcharge('sharm-el-sheikh', { adult: 1, child: 0, infant: 0 }),
    (error: unknown) => error instanceof TransferPricingError && error.message === 'Unknown hotel region'
  );
  assert.throws(() => calculateTransferSurcharge('<script>', { adult: 1, child: 0, infant: 0 }), TransferPricingError);
  assert.throws(() => calculateTransferSurcharge('HURGHADA', { adult: 1, child: 0, infant: 0 }), TransferPricingError);
  assert.equal(isSupportedHotelRegion('el-quseir'), true);
  assert.equal(isSupportedHotelRegion('nope'), false);
});

test('no region selected means no surcharge line', () => {
  assert.equal(calculateTransferSurcharge(undefined, { adult: 2, child: 1, infant: 0 }), null);
  assert.equal(calculateTransferSurcharge(null, { adult: 2, child: 1, infant: 0 }), null);
  assert.equal(calculateTransferSurcharge('', { adult: 2, child: 1, infant: 0 }), null);
});

test('tampered client surcharge cannot change the result', () => {
  // The shared function has no amount parameter at all — a browser-claimed
  // surcharge value has nowhere to enter. The same region + server-validated
  // quantities always produce the identical server-derived surcharge.
  const a = calculateTransferSurcharge('el-quseir', { adult: 2, child: 1, infant: 0 });
  const b = calculateTransferSurcharge('el-quseir', { adult: 2, child: 1, infant: 0 });
  assert.equal(a?.subtotal, b?.subtotal);
  assert.equal(a?.subtotal, 105);
});

// Server-loaded rows mirroring checkout-pricing.test.ts
const tour = { price: 100, max_guests: 8 };
const participantRows = [
  { person_type: 'adult', price: 50, currency: 'EUR', min_age: 12, max_age: 120, is_active: true },
  { person_type: 'child', price: 25, currency: 'EUR', min_age: 3, max_age: 11, is_active: true },
  { person_type: 'infant', price: 0, currency: 'EUR', min_age: 0, max_age: 2, is_active: true },
];
const approvedExtras = [{ id: 'extra-1', name: 'Hotel Transfer', price: 15 }];
const quantities = { adult: 2, child: 1, infant: 1 };

test('participants + extras + transfer combine into the final total', () => {
  const { calculation } = resolveServerCheckout({
    tour,
    participantRows,
    quantities,
    requestedExtraIds: ['extra-1'],
    approvedExtras,
  });
  const transfer = calculateTransferSurcharge('el-quseir', quantities);
  assert.ok(transfer);
  assert.equal(calculation.participantSubtotal, 125);
  assert.equal(calculation.extrasSubtotal, 45);
  assert.equal(transfer.subtotal, 105); // 35 × 3 paying guests
  const finalTotal = calculation.subtotal + transfer.subtotal;
  assert.equal(finalTotal, 275);
  assert.equal(calculateDepositAmount(finalTotal), 82.5);
});

test('deposit and Stripe cents come from the final total including transfer', () => {
  const { calculation } = resolveServerCheckout({
    tour,
    participantRows,
    quantities,
    requestedExtraIds: ['extra-1'],
    approvedExtras,
  });
  const transfer = calculateTransferSurcharge('marsa-alam', quantities);
  assert.ok(transfer);
  const finalTotal = calculation.subtotal + transfer.subtotal; // 170 + 150
  assert.equal(finalTotal, 320);
  assert.equal(calculateDepositAmount(finalTotal), 96);
  assert.equal(toStripeCents(finalTotal), 32000);
  assert.equal(toStripeCents(calculateDepositAmount(finalTotal)), 9600);
});

test('decimal prices and surcharge round correctly to Stripe cents', () => {
  const decimalRows = [
    { person_type: 'adult', price: 19.95, currency: 'EUR', min_age: 12, max_age: 120, is_active: true },
    { person_type: 'child', price: 9.99, currency: 'EUR', min_age: 3, max_age: 11, is_active: true },
    { person_type: 'infant', price: 0, currency: 'EUR', min_age: 0, max_age: 2, is_active: true },
  ];
  const { calculation } = resolveServerCheckout({
    tour,
    participantRows: decimalRows,
    quantities,
    requestedExtraIds: [],
    approvedExtras,
  });
  const transfer = calculateTransferSurcharge('sahl-hasheesh', quantities); // 5 × 3
  assert.ok(transfer);
  assert.equal(calculation.participantSubtotal, 49.89);
  const finalTotal = calculation.subtotal + transfer.subtotal; // 49.89 + 15
  assert.equal(finalTotal, 64.89);
  assert.equal(toStripeCents(finalTotal), 6489);
  assert.equal(calculateDepositAmount(finalTotal), 19.47); // 19.467 → 19.47
  assert.equal(toStripeCents(calculateDepositAmount(finalTotal)), 1947);
});
