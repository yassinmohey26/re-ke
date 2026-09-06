import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMetadata = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMetadata('bookingCancelledTitle');
  const description = tMetadata('bookingCancelledDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/booking/abgebrochen`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-default.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/booking/abgebrochen`,
      languages: {
        'de': `${baseUrl}/de/booking/abgebrochen`,
        'en': `${baseUrl}/en/booking/abgebrochen`,
        'ru': `${baseUrl}/ru/booking/abgebrochen`,
        'ar': `${baseUrl}/ar/booking/abgebrochen`,
        'fr': `${baseUrl}/fr/booking/abgebrochen`,
        'hu': `${baseUrl}/hu/booking/abgebrochen`,
        'x-default': `${baseUrl}/de/booking/abgebrochen`,
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
