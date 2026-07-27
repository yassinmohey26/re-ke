import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import TourCard from '@/components/cards/TourCard';
import { getLocalizedAllTours } from '@/lib/data/tours';
import styles from '../page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tours');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = t('categoryWater');
  const description = t('categoryWaterDesc');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/touren/wassersport`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${baseUrl}/og-default.jpg`] },
    alternates: {
      canonical: `${baseUrl}/${locale}/touren/wassersport`,
      languages: {
        'de': `${baseUrl}/de/touren/wassersport`,
        'en': `${baseUrl}/en/touren/wassersport`,
        'ru': `${baseUrl}/ru/touren/wassersport`,
        'ar': `${baseUrl}/ar/touren/wassersport`,
        'fr': `${baseUrl}/fr/touren/wassersport`,
        'hu': `${baseUrl}/hu/touren/wassersport`,
      },
    },
  };
}

export function generateStaticParams() {
  return [];
}

export default async function WassersportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tours = await getLocalizedAllTours(locale);
  const catTours = tours.filter(t => t.category === 'wassersport');
  const t = await getTranslations('tours');

  return (
    <>
      <PageHeader
        eyebrow={t('categoryWater')}
        title={t('categoryWaterTitle')}
        description={t('categoryWaterDesc')}
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
