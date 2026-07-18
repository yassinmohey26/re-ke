'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BookingForm from '@/components/forms/BookingForm';
import styles from './page.module.css';

function BookingContent() {
  const t = useTranslations('booking');
  const searchParams = useSearchParams();
  const tourSlug = searchParams.get('tour') ?? '';

  if (!tourSlug) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t('noTourTitle')}</h1>
          <p className={styles.description}>
            {t('noTourDesc')}
          </p>
          <a href="/touren" className={styles.primaryButton}>
            {t('noTourCta')}
          </a>
        </div>
      </div>
    );
  }

  const tourName = tourSlug
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
        <BookingForm tourSlug={tourSlug} tourName={tourName} />
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
