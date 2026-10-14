'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTourBooking } from './TourBookingContext';

interface Props {
  styles: Record<string, string>;
  variant: 'overlay' | 'dock';
}

export default function MobileTourBookingAction({
  styles: css,
  variant,
}: Props) {
  const locale = useLocale();
  const t = useTranslations('tours');
  const {
    startingPrice,
    bookingHref,
  } = useTourBooking();

  const displayPrice = startingPrice?.price;
  const formattedPrice =
    displayPrice == null
      ? t('requestOnly')
      : new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(displayPrice);

  return (
    <div
      className={
        variant === 'overlay'
          ? css.mobileBookingOverlay
          : css.mobileBookingDock
      }
    >
      <span className={css.mobileBookingPrice}>
        {displayPrice != null && (
          <small className={css.mobileBookingFrom}>{t('from')}</small>
        )}
        <strong>{formattedPrice}</strong>
        {displayPrice != null && (
          <small className={css.mobileBookingPer}>
            {t('perPerson')}
          </small>
        )}
      </span>

      <Link href={bookingHref} className={css.mobileBookingCta}>
        {t('bookTour')}
      </Link>
    </div>
  );
}
