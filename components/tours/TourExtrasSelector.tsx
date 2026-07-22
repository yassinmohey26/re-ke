'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTourBooking } from './TourBookingContext';

export default function TourExtrasSelector({ styles }: { styles: { [key: string]: string } }) {
  const t = useTranslations('tours');
  const { total, bookingHref } = useTourBooking();

  return (
    <>
      <div className={styles.bookingPrice}>
        {total != null ? (
          <>
            <span className={styles.priceAmount}>{t('from')} {total} EUR</span>
            <span className={styles.pricePer}>{t('perPerson')}</span>
          </>
        ) : (
          <span className={styles.priceAmount}>{t('requestOnly')}</span>
        )}
      </div>

      <Link href={bookingHref} className="btn btn--primary btn--lg" style={{ width: '100%', textAlign: 'center' }}>
        {t('bookTour')}
      </Link>
      <p style={{ fontSize: 12, color: 'var(--color-text-5)', textAlign: 'center', marginTop: 'var(--space-2)' }}>
        {t('noDeposit')}
      </p>
    </>
  );
}
