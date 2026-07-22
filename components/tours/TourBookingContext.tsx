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
  guests: number;
  setGuests: (n: number) => void;
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
  pricingTiers = [],
  extras,
  children,
}: {
  slug: string;
  price: number | null;
  pricingTiers?: PricingTier[];
  extras: Extra[];
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [guests, setGuests] = useState(2);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const value = useMemo(() => {
    const pricePerPerson = getPriceForGuests(pricingTiers, price, guests);
    const extrasTotal = extras
      .filter((e) => selected.includes(e.id))
      .reduce((sum, e) => sum + e.price, 0);
    const total = pricePerPerson != null ? pricePerPerson * guests + extrasTotal : null;
    const bookingHref =
      selected.length > 0
        ? `/booking?tour=${slug}&extras=${selected.join(',')}&guests=${guests}`
        : `/booking?tour=${slug}&guests=${guests}`;
    return { price, pricePerPerson, guests, setGuests, pricingTiers, extras, selected, toggle, extrasTotal, total, bookingHref };
  }, [price, guests, pricingTiers, slug, extras, selected]);

  return <TourBookingContext.Provider value={value}>{children}</TourBookingContext.Provider>;
}
