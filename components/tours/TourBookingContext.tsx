'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { type PricingTier, getPriceForGuests, applyDiscount } from '@/lib/pricing-table';
import type { Discount } from '@/lib/data/tours';
import type { TourChildDiscount } from '@/lib/child-discounts';
import type { ParticipantPrice } from '@/lib/participant-pricing';
import {
  computeTierPrice,
  findTierForChild,
  findTierForInfant,
  resolveChildDiscounts,
} from '@/lib/child-discounts';

interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface TourBookingContextValue {
  price: number | null;
  pricePerPerson: number | null;
  salePricePerPerson: number | null;
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
    const pricePerPerson = participantPrices.adult?.price ?? getPriceForGuests(pricingTiers, price, guestsForPricing);
    const activeTierIndex = pricingTiers.findIndex(
      t => guestsForPricing >= t.minGuests && guestsForPricing <= t.maxGuests
    );
    const salePricePerPerson = pricePerPerson != null
      ? applyDiscount(pricePerPerson, discount, activeTierIndex >= 0 ? activeTierIndex : undefined)
      : null;
    const hasSale = salePricePerPerson != null && pricePerPerson != null && salePricePerPerson < pricePerPerson;
    const extrasTotal = extras
      .filter((e) => selected.includes(e.id))
      .reduce((sum, e) => sum + e.price, 0) * guestsForPricing;
    const effectivePrice = salePricePerPerson ?? pricePerPerson;
    const infantTier = findTierForInfant(tiers);
    const childTier = findTierForChild(tiers);
    const total = effectivePrice != null
      ? (() => {
          const adultTotal = effectivePrice * adults;
          const childPrice = participantPrices.infant?.price ?? (infantTier ? computeTierPrice(infantTier, effectivePrice) : 0);
          const childrenPrice = participantPrices.child?.price ?? (childTier ? computeTierPrice(childTier, effectivePrice) : Math.round(effectivePrice / 2));
          return adultTotal + childrenPrice * childrenCount + childPrice * infants;
        })() + extrasTotal
      : null;
    const bookingHref =
      `/booking?tour=${slug}&adults=${adults}&children=${childrenCount}&infants=${infants}${selected.length > 0 ? `&extras=${selected.join(',')}` : ''}`;

    return {
      price,
      pricePerPerson,
      salePricePerPerson,
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
      extras,
      selected,
      toggle,
      extrasTotal,
      total,
      bookingHref,
      participantPrices,
    };
  }, [price, adults, childrenCount, infants, maxGuests, pricingTiers, discount, childDiscounts, participantPrices, slug, extras, selected]);

  return <TourBookingContext.Provider value={value}>{children}</TourBookingContext.Provider>;
}
