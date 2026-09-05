// Server-safe transfer / hotel-region surcharge rules, shared by the booking
// form (display only) and the server-side booking + Stripe checkout paths.
// No client-supplied amount ever enters these functions — the browser sends
// only the region slug; the surcharge is always derived here.

export type HotelRegionSlug =
  | 'hurghada'
  | 'makadi-bay'
  | 'sahl-hasheesh'
  | 'el-gouna'
  | 'soma-bay'
  | 'safaga'
  | 'el-quseir'
  | 'marsa-alam';

// Surcharge per paying guest (adults + children; infants are excluded) in EUR.
export const TRANSFER_SURCHARGES: Readonly<Record<HotelRegionSlug, number>> = {
  hurghada: 0,
  'makadi-bay': 5,
  'sahl-hasheesh': 5,
  'el-gouna': 10,
  'soma-bay': 10,
  safaga: 10,
  'el-quseir': 35,
  'marsa-alam': 50,
};

const SUPPORTED_REGIONS = new Set(Object.keys(TRANSFER_SURCHARGES));

export class TransferPricingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransferPricingError';
  }
}

export interface TransferSurcharge {
  region: HotelRegionSlug;
  /** Surcharge per paying guest in EUR (supports decimals). */
  unitPrice: number;
  /** Paying guests: adults + children. Infants are excluded. */
  quantity: number;
  subtotal: number;
  currency: 'EUR';
}

export function isSupportedHotelRegion(region: string | null | undefined): region is HotelRegionSlug {
  return typeof region === 'string' && SUPPORTED_REGIONS.has(region);
}

/**
 * Pure calculation for the transfer surcharge.
 * - No region selected → null (no surcharge line).
 * - Hurghada → a line with unitPrice 0 (included in the tour price).
 * - Unknown or malformed region → TransferPricingError; callers must reject
 *   the request instead of guessing a price.
 * Only adults and children count as paying guests, matching the extras rule.
 */
export function calculateTransferSurcharge(
  region: string | null | undefined,
  quantities: { adult: number; child: number; infant: number }
): TransferSurcharge | null {
  if (region == null || region === '') return null;
  if (!isSupportedHotelRegion(region)) {
    throw new TransferPricingError('Unknown hotel region');
  }
  const quantity = quantities.adult + quantities.child;
  const unitPrice = TRANSFER_SURCHARGES[region];
  return { region, unitPrice, quantity, subtotal: unitPrice * quantity, currency: 'EUR' };
}
