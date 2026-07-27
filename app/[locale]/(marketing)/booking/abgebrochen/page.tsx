import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMetadata = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  return {
    title: tMetadata('bookingCancelledTitle'),
    description: tMetadata('bookingCancelledDescription'),
    alternates: {
      canonical: `${baseUrl}/${locale}/booking/abgebrochen`,
      languages: {
        'de': `${baseUrl}/de/booking/abgebrochen`,
        'en': `${baseUrl}/en/booking/abgebrochen`,
        'ru': `${baseUrl}/ru/booking/abgebrochen`,
        'ar': `${baseUrl}/ar/booking/abgebrochen`,
        'fr': `${baseUrl}/fr/booking/abgebrochen`,
        'hu': `${baseUrl}/hu/booking/abgebrochen`,
      },
    },
  };
}

export default async function BookingCancelledPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'booking' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cancelIcon}>×</div>
        <h1 className={styles.title}>{t('cancelTitle')}</h1>
        <p className={styles.description}>
          {t('cancelDescription')}
        </p>
        <p className={styles.hint}>
          {t('cancelHint')}
        </p>
        <div className={styles.actions}>
          <Link href="/touren" className={styles.primaryButton}>{tNav('tours')}</Link>
          <Link href="/kontakt" className={styles.secondaryButton}>{tNav('contact')}</Link>
        </div>
      </div>
    </div>
  );
}
