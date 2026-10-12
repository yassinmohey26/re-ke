import {
  calculateParticipantPrice,
  normalizeParticipantPrices,
  type ParticipantPrice,
  type ParticipantType,
  type PriceCalculation,
} from './participant-pricing';
import { getTourPricingTiers, resolveTourUnitPrices } from './tour-pricing';
import type { TourChildDiscount } from './child-discounts';

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
  description?: string | null;
  discount?: {
    active: boolean;
    percentage: number;
    tierPrices?: (number | null)[];
    pricingTiers?: { min: number; max: number; price: number }[];
  } | null;
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
  quantities: ParticipantQuantities,
  childDiscountRows: TourChildDiscount[] = [],
): { prices: Partial<Record<ParticipantType, ParticipantPrice>>; legacyFallback: boolean } {
  const structured = normalizeParticipantPrices(participantRows ?? []);
  const groupTiers = getTourPricingTiers(tour.discount, tour.description);
  const unitPrices = resolveTourUnitPrices({
    basePrice: tour.price == null ? null : Number(tour.price),
    adultCount: quantities.adult,
    groupTiers,
    discount: tour.discount,
    participantPrices: structured,
    childDiscounts: childDiscountRows,
  });
  if (unitPrices.adult == null || !Number.isFinite(unitPrices.adult)) {
    throw new CheckoutPricingError('Tour price is unavailable');
  }
  const currency = structured.adult?.currency ?? structured.child?.currency ?? structured.infant?.currency ?? 'EUR';
  const makePrice = (personType: ParticipantType, price: number, minAge: number, maxAge: number): ParticipantPrice => ({
    personType,
    price,
    currency,
    minAge,
    maxAge,
    isActive: true,
  });
  return {
    prices: {
      adult: makePrice('adult', unitPrices.adult, structured.adult?.minAge ?? 11, structured.adult?.maxAge ?? 120),
      child: makePrice('child', unitPrices.child ?? unitPrices.adult / LEGACY_CHILD_PRICE_DIVISOR, structured.child?.minAge ?? 3, structured.child?.maxAge ?? 10),
      infant: makePrice('infant', unitPrices.infant ?? 0, structured.infant?.minAge ?? 0, structured.infant?.maxAge ?? 2),
    },
    legacyFallback: Object.keys(structured).length === 0 && groupTiers.length === 0,
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
  childDiscountRows?: TourChildDiscount[];
  quantities: ParticipantQuantities;
  requestedExtraIds: string[];
  approvedExtras: ApprovedExtraRow[];
}): { calculation: PriceCalculation; guests: number; legacyFallback: boolean } {
  const guests = validateParticipantQuantities(args.quantities, args.tour.max_guests);
  const { prices, legacyFallback } = resolveParticipantPrices(args.tour, args.participantRows, args.quantities, args.childDiscountRows);
  const selectedIds = sanitizeExtraIds(args.requestedExtraIds);
  const extras = validateExtraSelection(selectedIds, args.approvedExtras);
  const calculation = calculateParticipantPrice({
    prices,
    quantities: args.quantities,
    extras: extras.map((extra) => ({ id: extra.id, name: extra.name, price: Number(extra.price) })),
  });
  return { calculation, guests, legacyFallback };
}
