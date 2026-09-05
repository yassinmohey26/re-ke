'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTourBooking } from './TourBookingContext';
import { applyDiscount } from '@/lib/pricing-table';
import { getBookingAgeLabels, type ChildDiscountLocale } from '@/lib/child-discounts';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

function getTodayLocalDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function GuestCounter({
  label,
  subtitle,
  count,
  min,
  max,
  onIncrease,
  onDecrease,
  css,
}: {
  label: string;
  subtitle: string;
  count: number;
  min: number;
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
  css: Record<string, string>;
}) {
  return (
    <div className={css.bookingGuestRow}>
      <div className={css.bookingGuestInfo}>
        <span className={css.bookingGuestLabel}>{label}</span>
        <span className={css.bookingGuestSubtitle}>{subtitle}</span>
      </div>
      <div className={css.bookingGuestPicker}>
        <button
          className={css.bookingGuestBtn}
          onClick={onDecrease}
          disabled={count <= min}
        >−</button>
        <span className={css.bookingGuestCount}>{count}</span>
        <button
          className={css.bookingGuestBtn}
          onClick={onIncrease}
          disabled={count >= max}
        >+</button>
      </div>
    </div>
  );
}

export default function TourBookingSidebar({ styles: css }: { styles: Record<string, string> }) {
  const t = useTranslations('tours');
  const tb = useTranslations('booking');
  const locale = useLocale() as ChildDiscountLocale;
  const {
    price, pricePerPerson, salePricePerPerson, hasSale, adults, children: childrenCount, infants,
    guests, maxGuests, setAdults, setChildren, setInfants,
    pricingTiers, discount, childDiscounts, extras, selected, toggle, extrasTotal, total, bookingHref,
    participantPrices,
  } = useTourBooking();
  const [date, setDate] = useState('');

  const ageLabels = getBookingAgeLabels(childDiscounts, locale);

  const displayPrice = salePricePerPerson ?? pricePerPerson ?? price ?? 0;
  const minimumDate = getTodayLocalDate();

  const adultsMax = maxGuests - childrenCount - infants;
  const childrenMax = maxGuests - adults - infants;
  const infantsMax = maxGuests - adults - childrenCount;

  // Build price breakdown line
  const childTiers = discount?.childTiers;
  const hasChildTiers = childTiers && childTiers.length >= 2;
  const breakdownPrice = salePricePerPerson ?? pricePerPerson;
  const resolveTierPrice = (priceString: string | undefined, fallbackRatio: number, fullPrice: number) => {
    if (!priceString) return Math.round(fullPrice * fallbackRatio);
    const s = priceString.trim().toLowerCase();
    if (!s || s === 'kostenlos' || s === 'frei' || s === 'free' || /^0\b/.test(s)) return 0;
    const pct = s.match(/(\d+)\s*%/);
    if (pct) return Math.round(fullPrice * parseFloat(pct[1]) / 100);
    if (s.includes('voller') || s.includes('full')) return fullPrice;
    const m = s.match(/[\d,.]+/);
    if (m) return parseFloat(m[0].replace(',', '.'));
    return Math.round(fullPrice * fallbackRatio);
  };
  let breakdown = null;
  if (breakdownPrice != null) {
    const parts: string[] = [];
    if (adults > 0) parts.push(`${adults} × ${breakdownPrice} €`);
    if (childrenCount > 0) {
      if (hasChildTiers) {
        const cp = participantPrices?.child?.price ?? resolveTierPrice(childTiers[1]?.price, 0.5, breakdownPrice);
        parts.push(`${childrenCount} × ${cp.toFixed(0)} €`);
      } else {
        parts.push(`${childrenCount} × ${(participantPrices?.child?.price ?? breakdownPrice / 2).toFixed(2)} €`);
      }
    }
    if (infants > 0) {
      if (hasChildTiers) {
        const ip = participantPrices?.infant?.price ?? resolveTierPrice(childTiers[0]?.price, 0, breakdownPrice);
        parts.push(`${infants} × ${ip.toFixed(0)} €`);
      } else {
        parts.push(`${infants} × ${(participantPrices?.infant?.price ?? 0).toFixed(2)} €`);
      }
    }
    if (parts.length > 1 && total != null) {
      breakdown = (
        <span className={css.bookingTotalLine}>
          {parts.join(' + ')} = <strong>{total.toFixed(2)} EUR</strong>
        </span>
      );
    }
  }

  const bookingHrefWithSelection = `${bookingHref}${date ? `&date=${encodeURIComponent(date)}` : ''}`;

  return (
    <div className={css.bookingCard}>
      {price != null ? (
        <div className={css.bookingPriceBlock}>
          {hasSale && pricePerPerson != null && (
            <span className={css.bookingOriginalPrice}>{pricePerPerson} EUR</span>
          )}
          {!hasSale && pricePerPerson != null && pricePerPerson !== price && (
            <span className={css.bookingOriginalPrice}>{price} EUR</span>
          )}
          <span className={`${css.bookingCurrentPrice} ${hasSale ? css.salePrice : ''}`}>{displayPrice} EUR</span>
          <span className={css.bookingPricePer}>{t('perPerson')}</span>
          {breakdown}
          {guests > 1 && total != null && !breakdown && (
            <span className={css.bookingTotalLine}>
              {guests} × {displayPrice} EUR = <strong>{total.toFixed(2)} EUR</strong>
            </span>
          )}
        </div>
      ) : (
        <div className={css.bookingPriceBlock}>
          <span className={css.bookingCurrentPrice}>{t('requestOnly')}</span>
        </div>
      )}

      {/* Date Picker */}
      <div className={css.bookingField}>
        <label className={css.bookingLabel}>{t('selectDate')}</label>
        <input
          type="date"
          className={css.bookingInput}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={minimumDate}
        />
      </div>

      {/* Guest Category Pickers */}
      <div className={css.bookingField}>
        <label className={css.bookingLabel}>{t('guests')} ({guests}/{maxGuests})</label>
        <GuestCounter
          label={tb('adults')}
          subtitle={ageLabels.adults}
          count={adults}
          min={0}
          max={adultsMax}
          onIncrease={() => setAdults(Math.min(maxGuests, adults + 1))}
          onDecrease={() => setAdults(Math.max(0, adults - 1))}
          css={css}
        />
        <GuestCounter
          label={tb('children')}
          subtitle={ageLabels.children}
          count={childrenCount}
          min={0}
          max={childrenMax}
          onIncrease={() => setChildren(Math.min(maxGuests, childrenCount + 1))}
          onDecrease={() => setChildren(Math.max(0, childrenCount - 1))}
          css={css}
        />
        <GuestCounter
          label={tb('infant')}
          subtitle={ageLabels.infants}
          count={infants}
          min={0}
          max={infantsMax}
          onIncrease={() => setInfants(Math.min(maxGuests, infants + 1))}
          onDecrease={() => setInfants(Math.max(0, infants - 1))}
          css={css}
        />
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className={css.bookingExtras}>
          <span className={css.bookingLabel}>{t('extras')}</span>
          {extras.map((extra) => (
            <label key={extra.id} className={css.bookingExtraItem}>
              <input
                type="checkbox"
                checked={selected.includes(extra.id)}
                onChange={() => toggle(extra.id)}
                className={css.bookingExtraCheck}
              />
              <span className={css.bookingExtraName}>{extra.name}</span>
              <span className={css.bookingExtraPrice}>+{extra.price.toFixed(0)} EUR / {t('perPerson')}</span>
            </label>
          ))}
        </div>
      )}

      {/* CTA Buttons */}
      <Link href={bookingHrefWithSelection} className="btn btn--primary btn--lg" style={{ width: '100%', textAlign: 'center' }}>
        {t('bookTour')}
      </Link>
      <p style={{ fontSize: 12, color: 'var(--color-text-5)', textAlign: 'center', marginTop: 'var(--space-2)' }}>
        {t('noDeposit')}
      </p>
      <Link href={bookingHrefWithSelection} className="btn btn--outline btn--lg" style={{ width: '100%', textAlign: 'center', marginTop: 'var(--space-3)' }}>
        {t('submitRequest')}
      </Link>
    </div>
  );
}
