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
  return {
    title: t('categoryHalfDay'),
    description: t('categoryHalfDayDesc'),
  };
}

export function generateStaticParams() {
  return [];
}

export default async function HalbtagstourenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tours = await getLocalizedAllTours(locale);
  const catTours = tours.filter(t => t.category === 'halbtag');
  const t = await getTranslations('tours');

  return (
    <>
      <PageHeader
        eyebrow={t('categoryHalfDay')}
        title={t('categoryHalfDayTitle')}
        description={t('categoryHalfDayDesc')}
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
