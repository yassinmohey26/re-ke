import { applyDiscount, getPriceForGuests, parsePricingTiers, type PricingTier } from './pricing-table';
import {
  computeTierPrice,
  findTierForChild,
  findTierForInfant,
  resolveChildDiscounts,
  type TourChildDiscount,
} from './child-discounts';

type PersonType = 'adult' | 'child' | 'infant';

export function getTourPricingTiers(
  discount: { pricingTiers?: { min: number; max: number; price: number }[] } | null | undefined,
  baseDescription: string | null | undefined,
): PricingTier[] {
  const rows = discount?.pricingTiers;
  if (Array.isArray(rows) && rows.length > 0) {
    return rows.map(row => ({
      minGuests: Number(row.min),
      maxGuests: Number(row.max),
      pricePerPerson: Number(row.price),
    }));
  }
  return parsePricingTiers(baseDescription ?? '');
}

export function resolveTourUnitPrices(args: {
  basePrice: number | null;
  adultCount: number;
  groupTiers?: PricingTier[];
  discount?: { active: boolean; percentage: number; tierPrices?: (number | null)[] } | null;
  participantPrices?: Partial<Record<PersonType, { price: number }>>;
  childDiscounts?: TourChildDiscount[];
}) {
  const groupTiers = args.groupTiers ?? [];
  const participantPrices = args.participantPrices ?? {};
  const tierIndex = groupTiers.findIndex(
    tier => args.adultCount >= tier.minGuests && args.adultCount <= tier.maxGuests,
  );
  const adultBeforeDiscount = groupTiers.length > 0
    ? getPriceForGuests(groupTiers, args.basePrice, args.adultCount)
    : participantPrices.adult?.price ?? args.basePrice;
  const adult = adultBeforeDiscount == null
    ? null
    : applyDiscount(adultBeforeDiscount, args.discount ?? null, tierIndex >= 0 ? tierIndex : undefined);
  const childTiers = resolveChildDiscounts(args.childDiscounts);

  return {
    adultBeforeDiscount,
    adult,
    child: participantPrices.child?.price ?? (
      adult == null ? null : computeTierPrice(findTierForChild(childTiers)!, adult)
    ),
    infant: participantPrices.infant?.price ?? (
      adult == null ? null : computeTierPrice(findTierForInfant(childTiers)!, adult)
    ),
    tierIndex,
  };
}

export function getTourStartingPrice(args: {
  basePrice: number | null;
  maxGuests: number;
  discount?: { active: boolean; percentage: number; tierPrices?: (number | null)[]; pricingTiers?: { min: number; max: number; price: number }[] } | null;
  baseDescription?: string | null;
  participantPrices?: Partial<Record<PersonType, { price: number }>>;
}): { price: number; original: number; hasSale: boolean } | null {
  const groupTiers = getTourPricingTiers(args.discount, args.baseDescription);
  let best: { price: number; original: number; hasSale: boolean } | null = null;
  for (let adults = 1; adults <= Math.min(args.maxGuests, 8); adults++) {
    const unit = resolveTourUnitPrices({
      basePrice: args.basePrice,
      adultCount: adults,
      groupTiers,
      discount: args.discount,
      participantPrices: args.participantPrices,
    });
    if (unit.adult == null || !Number.isFinite(unit.adult)) continue;
    if (best == null || unit.adult < best.price) {
      const original = unit.adultBeforeDiscount ?? unit.adult;
      best = { price: unit.adult, original, hasSale: unit.adult < original };
    }
  }
  return best;
}
