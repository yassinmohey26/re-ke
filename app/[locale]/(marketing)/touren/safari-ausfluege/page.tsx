import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import TourCard from '@/components/cards/TourCard';
import { getLocalizedAllTours } from '@/lib/data/tours';
import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tours');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = t('categoryDesert');
  const description = t('categoryDesertDesc');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/touren/safari-ausfluege`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${baseUrl}/og-default.jpg`] },
    alternates: {
      canonical: `${baseUrl}/${locale}/touren/safari-ausfluege`,
      languages: {
        'de': `${baseUrl}/de/touren/safari-ausfluege`,
        'en': `${baseUrl}/en/touren/safari-ausfluege`,
        'ru': `${baseUrl}/ru/touren/safari-ausfluege`,
        'ar': `${baseUrl}/ar/touren/safari-ausfluege`,
        'fr': `${baseUrl}/fr/touren/safari-ausfluege`,
        'hu': `${baseUrl}/hu/touren/safari-ausfluege`,
        'x-default': `${baseUrl}/de/touren/safari-ausfluege`,
      },
    },
  };
}

export function generateStaticParams() {
  return [];
}

export default async function SafariAusfluegePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tours = await getLocalizedAllTours(locale);
  const catTours = tours.filter(t => t.category === 'safari');
  const t = await getTranslations('tours');

  return (
    <>
      <PageHeader
        eyebrow={t('categoryDesert')}
        title={t('categoryDesertTitle')}
        description={t('categoryDesertDesc')}
      />
      <section className="section">
        <div className="container">
          <p className={styles.count}>{catTours.length} {t('toursCount')}</p>
          <div className={styles.grid}>
            {catTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
