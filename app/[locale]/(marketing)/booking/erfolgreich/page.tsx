import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { retrieveSession } from '@/lib/stripe';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMetadata = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMetadata('bookingSuccessTitle');
  const description = tMetadata('bookingSuccessDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/booking/erfolgreich`,
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
      canonical: `${baseUrl}/${locale}/booking/erfolgreich`,
      languages: {
        'de': `${baseUrl}/de/booking/erfolgreich`,
        'en': `${baseUrl}/en/booking/erfolgreich`,
        'ru': `${baseUrl}/ru/booking/erfolgreich`,
        'ar': `${baseUrl}/ar/booking/erfolgreich`,
        'fr': `${baseUrl}/fr/booking/erfolgreich`,
        'hu': `${baseUrl}/hu/booking/erfolgreich`,
        'x-default': `${baseUrl}/de/booking/erfolgreich`,
      },
    },
  };
}

export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'booking' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const { session_id } = await searchParams;

  if (!session_id) {
    redirect(`/${locale}/booking/abgebrochen?reason=missing_session`);
  }

  let session: Awaited<ReturnType<typeof retrieveSession>>;
  try {
    session = await retrieveSession(session_id);
  } catch {
    redirect(`/${locale}/booking/abgebrochen?reason=invalid_session`);
  }

  if (session.payment_status !== 'paid' || !session.metadata?.bookingId) {
    redirect(`/${locale}/booking/abgebrochen?reason=unpaid`);
  }

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
