'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTourBooking } from './TourBookingContext';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

function getTodayLocalDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export default function TourBookingSidebar({ styles: css }: { styles: Record<string, string> }) {
  const t = useTranslations('tours');
  const { price, pricePerPerson, guests, setGuests, pricingTiers, extras, selected, toggle, extrasTotal, total, bookingHref } = useTourBooking();
  const [date, setDate] = useState('');

  const displayPrice = pricePerPerson ?? price ?? 0;
  const displayTotal = total ?? displayPrice * guests;
  const minimumDate = getTodayLocalDate();

  const bookingHrefWithSelection = `${bookingHref}${date ? `&date=${encodeURIComponent(date)}` : ''}&guests=${guests}`;

  return (
    <div className={css.bookingCard}>
      {price != null ? (
        <div className={css.bookingPriceBlock}>
          {pricePerPerson != null && pricePerPerson !== price && (
            <span className={css.bookingOriginalPrice}>{price} EUR</span>
          )}
          <span className={css.bookingCurrentPrice}>{displayPrice} EUR</span>
          <span className={css.bookingPricePer}>{t('perPerson')}</span>
          {guests > 1 && pricePerPerson != null && (
            <span className={css.bookingTotalLine}>
              {guests} × {displayPrice} EUR = <strong>{displayTotal} EUR</strong>
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

      {/* Guest Picker */}
      <div className={css.bookingField}>
        <label className={css.bookingLabel}>{t('guests')}</label>
        <div className={css.bookingGuestPicker}>
          <button
            className={css.bookingGuestBtn}
            onClick={() => setGuests(Math.max(1, guests - 1))}
            disabled={guests <= 1}
          >−</button>
          <span className={css.bookingGuestCount}>{guests}</span>
          <button
            className={css.bookingGuestBtn}
            onClick={() => setGuests(Math.min(20, guests + 1))}
            disabled={guests >= 20}
          >+</button>
        </div>
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
              <span className={css.bookingExtraPrice}>+{extra.price.toFixed(0)} EUR</span>
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
