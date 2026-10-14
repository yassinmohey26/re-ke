'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTourBooking } from './TourBookingContext';

interface Props {
  styles: Record<string, string>;
  startingPrice?: number | null;
}

export default function MobileTourBookingAction({
  styles: css,
  startingPrice,
}: Props) {
  const locale = useLocale();
  const t = useTranslations('tours');
  const { bookingHref } = useTourBooking();

  const displayPrice = startingPrice ?? null;
  const formattedPrice =
    displayPrice == null
      ? t('requestOnly')
      : new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: Number.isInteger(displayPrice) ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(displayPrice);

  return (
    <div className={css.mobileBookingOverlay}>
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
