export type ChildDiscountType = 'free' | 'percentage' | 'full_price' | 'fixed_price';

export type ChildDiscountLocale = 'de' | 'en' | 'ar' | 'fr' | 'hu' | 'ru';

export interface TourChildDiscount {
  id?: string;
  tour_id?: string;
  age_from: number;
  age_to: number | null;
  discount_type: ChildDiscountType;
  discount_value: number | null;
  sort_order: number;
}

export interface ChildDiscountLabels {
  ageRange0to2: string;
  ageRange3to10: string;
  age11plus: string;
  ageFromPlus: (age: number) => string;
  ageRange: (from: number, to: number) => string;
  free: string;
  half: string;
  full: string;
  percent: (n: number) => string;
  fixedEuro: (n: number) => string;
}

const LABELS: Record<ChildDiscountLocale, Omit<ChildDiscountLabels, 'ageFromPlus' | 'ageRange' | 'percent' | 'fixedEuro'>> = {
  de: {
    ageRange0to2: '0–2 Jahre',
    ageRange3to10: '3–10 Jahre',
    age11plus: 'Ab 11 Jahre',
    free: 'Kostenlos',
    half: '50% Ermäßigung',
    full: 'Voller Preis',
  },
  en: {
    ageRange0to2: '0–2 Years',
    ageRange3to10: '3–10 Years',
    age11plus: '11 Years and up',
    free: 'Free',
    half: '50% Discount',
    full: 'Full Price',
  },
  ar: {
    ageRange0to2: '0–2 سنة',
    ageRange3to10: '3–10 سنوات',
    age11plus: 'من 11 سنة',
    free: 'مجاني',
    half: 'خصم 50%',
    full: 'السعر الكامل',
  },
  fr: {
    ageRange0to2: '0–2 ans',
    ageRange3to10: '3–10 ans',
    age11plus: 'À partir de 11 ans',
    free: 'Gratuit',
    half: '50 % de réduction',
    full: 'Prix plein',
  },
  hu: {
    ageRange0to2: '0–2 év',
    ageRange3to10: '3–10 év',
    age11plus: '11 éves kortól',
    free: 'Ingyenes',
    half: '50% kedvezmény',
    full: 'Teljes ár',
  },
  ru: {
    ageRange0to2: '0–2 года',
    ageRange3to10: '3–10 лет',
    age11plus: 'От 11 лет',
    free: 'Бесплатно',
    half: 'Скидка 50%',
    full: 'Полная цена',
  },
};

const FROM_PLUS: Record<ChildDiscountLocale, string> = {
  de: 'Ab {age} Jahre',
  en: 'From {age} years',
  ar: 'من {age} سنة',
  fr: 'À partir de {age} ans',
  hu: '{age} éves kortól',
  ru: 'От {age} лет',
};

const RANGE: Record<ChildDiscountLocale, string> = {
  de: '{from}–{to} Jahre',
  en: '{from}–{to} years',
  ar: '{from}–{to} سنة',
  fr: '{from}–{to} ans',
  hu: '{from}–{to} év',
  ru: '{from}–{to} лет',
};

const PERCENT: Record<ChildDiscountLocale, string> = {
  de: '{n}% Ermäßigung',
  en: '{n}% discount',
  ar: 'خصم {n}%',
  fr: '{n} % de réduction',
  hu: '{n}% kedvezmény',
  ru: 'Скидка {n}%',
};

export function getChildDiscountLabels(locale: ChildDiscountLocale): ChildDiscountLabels {
  const base = LABELS[locale] ?? LABELS.de;
  return {
    ...base,
    ageFromPlus: (age: number) => (FROM_PLUS[locale] ?? FROM_PLUS.de).replace('{age}', String(age)),
    ageRange: (from: number, to: number) =>
      (RANGE[locale] ?? RANGE.de).replace('{from}', String(from)).replace('{to}', String(to)),
    percent: (n: number) => (PERCENT[locale] ?? PERCENT.de).replace('{n}', String(n)),
    fixedEuro: (n: number) => `${n} €`,
  };
}

/** Default tiers when a tour has no rows in tour_child_discounts (Option B). */
export const DEFAULT_CHILD_DISCOUNTS: TourChildDiscount[] = [
  { age_from: 0, age_to: 2, discount_type: 'free', discount_value: null, sort_order: 0 },
  { age_from: 3, age_to: 10, discount_type: 'percentage', discount_value: 50, sort_order: 1 },
  { age_from: 11, age_to: null, discount_type: 'full_price', discount_value: null, sort_order: 2 },
];

export function resolveChildDiscounts(rows: TourChildDiscount[] | null | undefined): TourChildDiscount[] {
  if (rows && rows.length > 0) {
    return [...rows].sort((a, b) => a.sort_order - b.sort_order || a.age_from - b.age_from);
  }
  return DEFAULT_CHILD_DISCOUNTS.map((t, i) => ({ ...t, sort_order: i }));
}

export function ageMatchesTier(age: number, tier: TourChildDiscount): boolean {
  if (age < tier.age_from) return false;
  if (tier.age_to == null) return true;
  return age <= tier.age_to;
}

/** Representative age for infant (0–2) and child (3–10) booking counters. */
export function findTierForInfant(tiers: TourChildDiscount[]): TourChildDiscount | undefined {
  const sorted = resolveChildDiscounts(tiers);
  return sorted.find(t => ageMatchesTier(0, t)) ?? sorted[0];
}

export function findTierForChild(tiers: TourChildDiscount[]): TourChildDiscount | undefined {
  const sorted = resolveChildDiscounts(tiers);
  return sorted.find(t => ageMatchesTier(5, t)) ?? sorted[1] ?? sorted[0];
}

/** Adult bracket: the highest full-price tier, else the last (highest) tier. */
export function findTierForAdult(tiers: TourChildDiscount[]): TourChildDiscount | undefined {
  const sorted = resolveChildDiscounts(tiers);
  const fullPriceTiers = sorted.filter(t => t.discount_type === 'full_price');
  return fullPriceTiers[fullPriceTiers.length - 1] ?? sorted[sorted.length - 1];
}

/**
 * Age-range subtitles for the booking card guest counters, derived from the
 * same tiers the Child Discounts table renders — one shared source of truth.
 */
export function getBookingAgeLabels(
  tiers: TourChildDiscount[],
  locale: ChildDiscountLocale,
): { adults: string; children: string; infants: string } {
  const adultTier = findTierForAdult(tiers);
  const childTier = findTierForChild(tiers);
  const infantTier = findTierForInfant(tiers);
  return {
    adults: adultTier ? formatAgeLabel(adultTier, locale) : '',
    children: childTier ? formatAgeLabel(childTier, locale) : '',
    infants: infantTier ? formatAgeLabel(infantTier, locale) : '',
  };
}

export function computeTierPrice(tier: TourChildDiscount, adultPrice: number): number {
  switch (tier.discount_type) {
    case 'free':
      return 0;
    case 'percentage': {
      const pct = tier.discount_value ?? 50;
      return Math.round(adultPrice * (pct / 100));
    }
    case 'full_price':
      return adultPrice;
    case 'fixed_price':
      return tier.discount_value ?? 0;
    default:
      return adultPrice;
  }
}

export function formatAgeLabel(tier: TourChildDiscount, locale: ChildDiscountLocale): string {
  const labels = getChildDiscountLabels(locale);
  if (tier.age_from === 0 && tier.age_to === 2) return labels.ageRange0to2;
  if (tier.age_from === 3 && tier.age_to === 10) return labels.ageRange3to10;
  if (tier.age_from === 11 && tier.age_to == null) return labels.age11plus;
  if (tier.age_to == null) return labels.ageFromPlus(tier.age_from);
  if (tier.age_from === tier.age_to) return labels.ageRange(tier.age_from, tier.age_to);
  return labels.ageRange(tier.age_from, tier.age_to);
}

export function formatDiscountLabel(tier: TourChildDiscount, locale: ChildDiscountLocale): string {
  const labels = getChildDiscountLabels(locale);
  switch (tier.discount_type) {
    case 'free':
      return labels.free;
    case 'percentage':
      return labels.percent(tier.discount_value ?? 50);
    case 'full_price':
      return labels.full;
    case 'fixed_price':
      return labels.fixedEuro(tier.discount_value ?? 0);
    default:
      return labels.full;
  }
}

export function parseChildDiscountRow(row: Record<string, unknown>): TourChildDiscount {
  return {
    id: typeof row.id === 'string' ? row.id : undefined,
    tour_id: typeof row.tour_id === 'string' ? row.tour_id : undefined,
    age_from: Number(row.age_from ?? 0),
    age_to: row.age_to == null ? null : Number(row.age_to),
    discount_type: row.discount_type as ChildDiscountType,
    discount_value: row.discount_value == null ? null : Number(row.discount_value),
    sort_order: Number(row.sort_order ?? 0),
  };
}

export type ChildDiscountInput = Omit<TourChildDiscount, 'id' | 'tour_id'>;

export function sanitizeChildDiscountInput(body: Record<string, unknown>): ChildDiscountInput | null {
  const age_from = Number(body.ageFrom ?? body.age_from);
  if (!Number.isFinite(age_from) || age_from < 0) return null;
  const age_to_raw = body.ageTo ?? body.age_to;
  const age_to =
    age_to_raw === '' || age_to_raw === null || age_to_raw === undefined
      ? null
      : Number(age_to_raw);
  if (age_to != null && (!Number.isFinite(age_to) || age_to < age_from)) return null;

  const discount_type = (body.discountType ?? body.discount_type) as ChildDiscountType;
  const allowed: ChildDiscountType[] = ['free', 'percentage', 'full_price', 'fixed_price'];
  if (!allowed.includes(discount_type)) return null;

  let discount_value: number | null =
    body.discountValue === '' || body.discountValue === undefined
      ? body.discount_value === '' || body.discount_value === undefined
        ? null
        : Number(body.discount_value)
      : Number(body.discountValue);
  if (discount_value != null && !Number.isFinite(discount_value)) discount_value = null;

  if (discount_type === 'percentage' && discount_value == null) discount_value = 50;
  if ((discount_type === 'free' || discount_type === 'full_price') && discount_value != null) {
    discount_value = null;
  }
  if (discount_type === 'fixed_price' && (discount_value == null || discount_value < 0)) return null;

  const sort_order = Number(body.sortOrder ?? body.sort_order ?? 0);

  return {
    age_from,
    age_to,
    discount_type,
    discount_value,
    sort_order,
  };
}
