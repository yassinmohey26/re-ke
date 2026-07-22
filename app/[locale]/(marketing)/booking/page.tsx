'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import BookingForm from '@/components/forms/BookingForm';
import styles from './page.module.css';

interface TourExtra {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface TourInfo {
  name: string;
  price: number | null;
  pricingTiers: { minGuests: number; maxGuests: number; pricePerPerson: number }[];
  extras: TourExtra[];
}

function getInitialGuestCount(value: string | null): number {
  const guests = Number(value);
  return Number.isInteger(guests) && guests >= 1 && guests <= 20 ? guests : 1;
}

function getInitialDate(value: string | null): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? '' : value;
}

function BookingContent() {
  const t = useTranslations('booking');
  const searchParams = useSearchParams();
  const tourSlug = searchParams.get('tour') ?? '';
  const extrasParam = searchParams.get('extras') ?? '';
  const initialSelectedExtraIds = extrasParam ? extrasParam.split(',').filter(Boolean) : [];
  const initialDate = getInitialDate(searchParams.get('date'));
  const initialGuests = getInitialGuestCount(searchParams.get('guests'));
  const [tourInfo, setTourInfo] = useState<TourInfo | null>(null);
  const [loadingTour, setLoadingTour] = useState(true);

  useEffect(() => {
    if (!tourSlug) {
      setLoadingTour(false);
      return;
    }
    fetch(`/api/tours/${tourSlug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setTourInfo(data))
      .finally(() => setLoadingTour(false));
  }, [tourSlug]);

  if (!tourSlug) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t('noTourTitle')}</h1>
          <p className={styles.description}>
            {t('noTourDesc')}
          </p>
          <Link href="/touren" className={styles.primaryButton}>
            {t('noTourCta')}
          </Link>
        </div>
      </div>
    );
  }

  if (loadingTour) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.description}>{t('pageLoading')}</p>
        </div>
      </div>
    );
  }

  const tourName = tourInfo?.name ?? tourSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('formTitle')}</h1>
        <p className={styles.description}>
          {t('formDesc')}
        </p>
        <BookingForm
          tourSlug={tourSlug}
          tourName={tourName}
          pricePerPerson={tourInfo?.price ?? undefined}
          pricingTiers={tourInfo?.pricingTiers ?? []}
          extras={tourInfo?.extras ?? []}
          initialSelectedExtraIds={initialSelectedExtraIds}
          initialDate={initialDate}
          initialGuests={initialGuests}
        />
      </div>
    </div>
  );
}

function BookingFallback() {
  const t = useTranslations('booking');
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.description}>{t('pageLoading')}</p>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingFallback />}>
      <BookingContent />
    </Suspense>
  );
}
