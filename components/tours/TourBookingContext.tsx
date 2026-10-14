'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { PricingTier } from '@/lib/pricing-table';
import { resolveTourUnitPrices } from '@/lib/tour-pricing';
import type { Discount } from '@/lib/data/tours';
import type { TourChildDiscount } from '@/lib/child-discounts';
import type { ParticipantPrice } from '@/lib/participant-pricing';
import { resolveChildDiscounts } from '@/lib/child-discounts';

interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface TourBookingContextValue {
  price: number | null;
  startingPrice: { price: number; original: number; hasSale: boolean } | null;
  pricePerPerson: number | null;
  salePricePerPerson: number | null;
  childPricePerPerson: number | null;
  infantPricePerPerson: number | null;
  hasSale: boolean;
  adults: number;
  children: number;
  infants: number;
  guests: number;
  guestsForPricing: number;
  maxGuests: number;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  setInfants: (n: number) => void;
  pricingTiers: PricingTier[];
  discount: Discount | null;
  childDiscounts: TourChildDiscount[];
  extras: Extra[];
  selected: string[];
  toggle: (id: string) => void;
  extrasTotal: number;
  total: number | null;
  bookingHref: string;
  participantPrices: Partial<Record<'adult' | 'child' | 'infant', ParticipantPrice>>;
}

const TourBookingContext = createContext<TourBookingContextValue | null>(null);

export function useTourBooking() {
  const ctx = useContext(TourBookingContext);
  if (!ctx) throw new Error('useTourBooking must be used within TourBookingProvider');
  return ctx;
}

export function TourBookingProvider({
  slug,
  price,
  startingPrice,
  maxGuests = 8,
  pricingTiers = [],
  discount = null,
  childDiscounts = [],
  participantPrices = {},
  extras,
  children,
}: {
  slug: string;
  price: number | null;
  startingPrice: { price: number; original: number; hasSale: boolean } | null;
  maxGuests?: number;
  pricingTiers?: PricingTier[];
  discount?: Discount | null;
  childDiscounts?: TourChildDiscount[];
  participantPrices?: Partial<Record<'adult' | 'child' | 'infant', ParticipantPrice>>;
  extras: Extra[];
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function setChildren(n: number) {
    setChildrenCount(n);
  }

  const value = useMemo(() => {
    const guestsTotal = adults + childrenCount + infants;
    const tiers = resolveChildDiscounts(childDiscounts);
    const guestsForPricing = adults;
    const unitPrices = resolveTourUnitPrices({
      basePrice: price,
      adultCount: adults,
      groupTiers: pricingTiers,
      discount,
      participantPrices,
      childDiscounts: tiers,
    });
    const pricePerPerson = unitPrices.adultBeforeDiscount;
    const salePricePerPerson = unitPrices.adult;
    const hasSale = salePricePerPerson != null && pricePerPerson != null && salePricePerPerson < pricePerPerson;
    const extrasTotal = extras
      .filter((e) => selected.includes(e.id))
      .reduce((sum, e) => sum + e.price, 0) * (adults + childrenCount);
    const effectivePrice = salePricePerPerson ?? pricePerPerson;
    const total = effectivePrice != null
      ? (() => {
          const adultTotal = effectivePrice * adults;
          return adultTotal + (unitPrices.child ?? 0) * childrenCount + (unitPrices.infant ?? 0) * infants;
        })() + extrasTotal
      : null;
    const bookingHref =
      `/booking?tour=${slug}&adults=${adults}&children=${childrenCount}&infants=${infants}${selected.length > 0 ? `&extras=${selected.join(',')}` : ''}`;

    return {
      price,
      startingPrice,
      pricePerPerson,
      salePricePerPerson,
      childPricePerPerson: unitPrices.child,
      infantPricePerPerson: unitPrices.infant,
      hasSale,
      adults,
      children: childrenCount,
      infants,
      guests: guestsTotal,
      guestsForPricing,
      maxGuests,
      setAdults,
      setChildren,
      setInfants: setInfants,
      pricingTiers,
      discount,
      childDiscounts: tiers,
      extras,
      selected,
      toggle,
      extrasTotal,
      total,
      bookingHref,
      participantPrices,
    };
  }, [price, startingPrice, adults, childrenCount, infants, maxGuests, pricingTiers, discount, childDiscounts, participantPrices, slug, extras, selected]);

  return <TourBookingContext.Provider value={value}>{children}</TourBookingContext.Provider>;
}
