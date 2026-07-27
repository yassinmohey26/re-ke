'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { type PricingTier, getPriceForGuests } from '@/lib/pricing-table';

interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface TourBookingContextValue {
  price: number | null;
  pricePerPerson: number | null;
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
  extras,
  children,
}: {
  slug: string;
  price: number | null;
  maxGuests?: number;
  pricingTiers?: PricingTier[];
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
    const guestsForPricing = adults + childrenCount;
    const pricePerPerson = getPriceForGuests(pricingTiers, price, guestsForPricing);
    const extrasTotal = extras
      .filter((e) => selected.includes(e.id))
      .reduce((sum, e) => sum + e.price, 0);
    // Adults: full price, Children: half price, Infants: free
    const total = pricePerPerson != null
      ? pricePerPerson * adults + (pricePerPerson / 2) * childrenCount + extrasTotal
      : null;
    const bookingHref =
      `/booking?tour=${slug}&adults=${adults}&children=${childrenCount}&infants=${infants}${selected.length > 0 ? `&extras=${selected.join(',')}` : ''}`;

    return {
      price,
      pricePerPerson,
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
      extras,
      selected,
      toggle,
      extrasTotal,
      total,
      bookingHref,
    };
  }, [price, adults, childrenCount, infants, maxGuests, pricingTiers, slug, extras, selected]);

  return <TourBookingContext.Provider value={value}>{children}</TourBookingContext.Provider>;
}
