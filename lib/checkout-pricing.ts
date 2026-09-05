import {
  calculateParticipantPrice,
  normalizeParticipantPrices,
  type ParticipantPrice,
  type ParticipantType,
  type PriceCalculation,
} from './participant-pricing';

// Pure, dependency-free checkout pricing rules for the Stripe checkout route.
// Every input is a server-loaded database row: the browser's totals, unit
// prices, extra names, and extra prices never enter these functions.

export const DEFAULT_MAX_GUESTS = 8;
export const MAX_PARTICIPANTS_PER_TYPE = 20;
// Legacy fallback for tours without structured pricing: child pays half the
// tour price, infants are free. Matches the historical booking behavior.
const LEGACY_CHILD_PRICE_DIVISOR = 2;

export class CheckoutPricingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckoutPricingError';
  }
}

export interface TourPricingRow {
  price: number | string | null;
  max_guests: number | null;
}

export interface ApprovedExtraRow {
  id: string;
  name: string;
  price: number | string;
}

export interface ParticipantQuantities {
  adult: number;
  child: number;
  infant: number;
}

/** Validates quantities and derives the guest count server-side. */
export function validateParticipantQuantities(
  quantities: ParticipantQuantities,
  maxGuests: number | null
): number {
  const types: ParticipantType[] = ['adult', 'child', 'infant'];
  for (const type of types) {
    const value = quantities[type];
    if (!Number.isInteger(value) || value < 0 || value > MAX_PARTICIPANTS_PER_TYPE) {
      throw new CheckoutPricingError('Invalid participant quantities');
    }
  }
  if (quantities.adult < 1) {
    throw new CheckoutPricingError('At least one adult is required');
  }
  const guests = quantities.adult + quantities.child + quantities.infant;
  if (guests > (maxGuests ?? DEFAULT_MAX_GUESTS)) {
    throw new CheckoutPricingError('Invalid participant quantities');
  }
  return guests;
}

/** Resolves active participant prices, falling back to legacy tour pricing. */
export function resolveParticipantPrices(
  tour: TourPricingRow,
  participantRows: Record<string, unknown>[],
  quantities: ParticipantQuantities
): { prices: Partial<Record<ParticipantType, ParticipantPrice>>; legacyFallback: boolean } {
  const structured = normalizeParticipantPrices(participantRows ?? []);
  if (Object.keys(structured).length > 0) {
    for (const type of ['adult', 'child', 'infant'] as const) {
      if (quantities[type] > 0 && !structured[type]) {
        throw new CheckoutPricingError('Configured participant price is missing');
      }
    }
    return { prices: structured, legacyFallback: false };
  }
  const tourPrice = Number(tour.price ?? 0);
  return {
    prices: {
      adult: { personType: 'adult', price: tourPrice, currency: 'EUR', minAge: 12, maxAge: 120, isActive: true },
      child: { personType: 'child', price: tourPrice / LEGACY_CHILD_PRICE_DIVISOR, currency: 'EUR', minAge: 3, maxAge: 11, isActive: true },
      infant: { personType: 'infant', price: 0, currency: 'EUR', minAge: 0, maxAge: 2, isActive: true },
    },
    legacyFallback: true,
  };
}

/** Strips display-only rows the booking UI mixes into the selection (e.g. `_adults`). */
export function sanitizeExtraIds(requestedIds: string[]): string[] {
  return requestedIds.filter((id) => typeof id === 'string' && id.length > 0 && !id.startsWith('_'));
}

/**
 * Matches requested extra IDs against the rows approved by the database for
 * THIS tour. Unknown IDs (missing, inactive, or belonging to another tour)
 * and duplicates are rejected; only the database rows are returned.
 */
export function validateExtraSelection(
  requestedIds: string[],
  approved: ApprovedExtraRow[]
): ApprovedExtraRow[] {
  if (new Set(requestedIds).size !== requestedIds.length) {
    throw new CheckoutPricingError('Duplicate extras are not allowed');
  }
  const approvedById = new Map(approved.map((extra) => [extra.id, extra]));
  for (const id of requestedIds) {
    if (!approvedById.has(id)) {
      throw new CheckoutPricingError('Invalid extra selected');
    }
  }
  return requestedIds.map((id) => approvedById.get(id)!);
}

/** Full server-side recalculation: participants + approved extras. */
export function resolveServerCheckout(args: {
  tour: TourPricingRow;
  participantRows: Record<string, unknown>[];
  quantities: ParticipantQuantities;
  requestedExtraIds: string[];
  approvedExtras: ApprovedExtraRow[];
}): { calculation: PriceCalculation; guests: number; legacyFallback: boolean } {
  const guests = validateParticipantQuantities(args.quantities, args.tour.max_guests);
  const { prices, legacyFallback } = resolveParticipantPrices(args.tour, args.participantRows, args.quantities);
  const selectedIds = sanitizeExtraIds(args.requestedExtraIds);
  const extras = validateExtraSelection(selectedIds, args.approvedExtras);
  const calculation = calculateParticipantPrice({
    prices,
    quantities: args.quantities,
    extras: extras.map((extra) => ({ id: extra.id, name: extra.name, price: Number(extra.price) })),
  });
  return { calculation, guests, legacyFallback };
}
