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
  const title = t('categorySnorkel');
  const description = t('categorySnorkelDesc');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/touren/schnorchel-touren`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${baseUrl}/og-default.jpg`] },
    alternates: {
      canonical: `${baseUrl}/${locale}/touren/schnorchel-touren`,
      languages: {
        'de': `${baseUrl}/de/touren/schnorchel-touren`,
        'en': `${baseUrl}/en/touren/schnorchel-touren`,
        'ru': `${baseUrl}/ru/touren/schnorchel-touren`,
        'ar': `${baseUrl}/ar/touren/schnorchel-touren`,
        'fr': `${baseUrl}/fr/touren/schnorchel-touren`,
        'hu': `${baseUrl}/hu/touren/schnorchel-touren`,
        'x-default': `${baseUrl}/de/touren/schnorchel-touren`,
      },
    },
  };
}

export function generateStaticParams() {
  return [];
}

export default async function SchnorchelTourenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tours = await getLocalizedAllTours(locale);
  const catTours = tours.filter(t => t.category === 'schnorchel');
  const t = await getTranslations('tours');

  return (
    <>
      <PageHeader
        eyebrow={t('categorySnorkel')}
        title={t('categorySnorkelTitle')}
        description={t('categorySnorkelDesc')}
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
