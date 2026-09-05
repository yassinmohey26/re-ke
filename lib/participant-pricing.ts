export type ParticipantType = 'adult' | 'child' | 'infant';

export interface ParticipantPrice {
  personType: ParticipantType;
  price: number;
  currency: string;
  minAge: number;
  maxAge: number;
  isActive: boolean;
}

export interface PriceLine {
  personType: ParticipantType;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  currency: string;
}

export interface PriceCalculation {
  lines: PriceLine[];
  extras: { id: string; name: string; quantity: number; unitPrice: number; subtotal: number }[];
  participantSubtotal: number;
  extrasSubtotal: number;
  subtotal: number;
  currency: string;
}

export function calculateParticipantPrice(args: {
  prices: Partial<Record<ParticipantType, ParticipantPrice>>;
  quantities: Record<ParticipantType, number>;
  extras?: { id: string; name: string; price: number }[];
  extrasPerParticipant?: number;
}): PriceCalculation {
  const types: ParticipantType[] = ['adult', 'child', 'infant'];
  const currency = Object.values(args.prices).find(Boolean)?.currency ?? 'EUR';
  const lines = types.map((personType) => {
    const quantity = args.quantities[personType] ?? 0;
    const unitPrice = args.prices[personType]?.price ?? 0;
    return { personType, quantity, unitPrice, subtotal: quantity * unitPrice, currency };
  });
  // Preserve the existing business rule: extras are charged per paying guest;
  // infants do not increase the extras quantity.
  const multiplier = args.extrasPerParticipant ?? (args.quantities.adult + args.quantities.child);
  const extras = (args.extras ?? []).map((extra) => ({
    id: extra.id,
    name: extra.name,
    quantity: multiplier,
    unitPrice: extra.price,
    subtotal: extra.price * multiplier,
  }));
  const participantSubtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const extrasSubtotal = extras.reduce((sum, extra) => sum + extra.subtotal, 0);
  return { lines, extras, participantSubtotal, extrasSubtotal, subtotal: participantSubtotal + extrasSubtotal, currency };
}

export function normalizeParticipantPrices(rows: Record<string, unknown>[]): Partial<Record<ParticipantType, ParticipantPrice>> {
  return Object.fromEntries((rows ?? []).filter((row) => row.is_active).map((row) => [row.person_type, {
    personType: row.person_type as ParticipantType,
    price: Number(row.price),
    currency: String(row.currency ?? 'EUR'),
    minAge: Number(row.min_age),
    maxAge: Number(row.max_age),
    isActive: Boolean(row.is_active),
  }]));
}

// ── Money helpers shared by the booking action and Stripe checkout ──

// Stripe checkout is currently created in EUR only; extend when multi-currency lands.
export const SUPPORTED_CURRENCIES: readonly string[] = ['EUR'];
export const STRIPE_MINIMUM_CENTS = 50; // Stripe minimum charge for EUR
export const DEPOSIT_PERCENT = 0.3;

export function toStripeCents(amount: number): number {
  return Math.round(amount * 100);
}

export function calculateDepositAmount(total: number, percent: number = DEPOSIT_PERCENT): number {
  return Math.round(total * percent * 100) / 100;
}
