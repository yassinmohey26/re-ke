'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { type PricingTier, getPriceForGuests, applyDiscount } from '@/lib/pricing-table';
import type { Discount } from '@/lib/data/tours';

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
  extras,
  children,
}: {
  slug: string;
  price: number | null;
  maxGuests?: number;
  pricingTiers?: PricingTier[];
  discount?: Discount | null;
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
    const hasFixedChildPricing = discount?.childTiers != null && discount.childTiers.length >= 2;
    const guestsForPricing = hasFixedChildPricing ? adults : adults + childrenCount;
    const pricePerPerson = getPriceForGuests(pricingTiers, price, guestsForPricing);
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
    const parsePrice = (s: string) => {
      const m = s.match(/[\d,.]+/);
      return m ? parseFloat(m[0].replace(',', '.')) : null;
    };
    const childTiers = discount?.childTiers;
    const hasChildTiers = childTiers && childTiers.length >= 2;
    const total = effectivePrice != null
      ? (() => {
          const adultTotal = effectivePrice * adults;
          if (hasChildTiers) {
            const childPrice = parsePrice(childTiers[1].price);
            const infantPrice = parsePrice(childTiers[0].price);
            return adultTotal
              + (childrenCount && childPrice != null ? childPrice * childrenCount : (effectivePrice / 2) * childrenCount)
              + (infants && infantPrice != null ? infantPrice * infants : 0);
          }
          return adultTotal + (effectivePrice / 2) * childrenCount;
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
    };
  }, [price, adults, childrenCount, infants, maxGuests, pricingTiers, discount, slug, extras, selected]);

  return <TourBookingContext.Provider value={value}>{children}</TourBookingContext.Provider>;
}
