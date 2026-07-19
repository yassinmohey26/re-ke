import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMetadata = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: tMetadata('bookingSuccessTitle'),
    description: tMetadata('bookingSuccessDescription'),
  };
}

export default async function BookingSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'booking' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.checkIcon}>✓</div>
        <h1 className={styles.title}>{t('successTitle')}</h1>
        <p className={styles.description}>
          {t('successDescription')}
        </p>
        <div className={styles.info}>
          <p>{t('successInfo')}</p>
        </div>
        <div className={styles.actions}>
          <Link href="/touren" className={styles.primaryButton}>{tNav('tours')}</Link>
          <Link href="/" className={styles.secondaryButton}>{tNav('home')}</Link>
        </div>
      </div>
    </div>
  );
}
