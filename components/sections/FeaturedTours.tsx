import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import TourCard from '@/components/cards/TourCard';
import Carousel from '@/components/ui/Carousel';
import { getFeaturedTours } from '@/lib/data/tours';

export default async function FeaturedTours({ locale }: { locale: string }) {
  const t = await getTranslations('homeFeatured');
  const tours = await getFeaturedTours(locale);

  if (tours.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-6)', marginBottom: 'var(--space-10)', flexWrap: 'wrap' }}>
          <div>
            <h2 className="section-title">
              {t('titlePart1')} <span className="text-accent">{t('titleAccent')}</span>
            </h2>
          </div>
        </div>
        <Carousel slideshow headerActions={
          <Link href="/touren" className="btn btn--ghost">
            {t('viewAll')}
          </Link>
        }>
          {tours.map((tour) => (
            <TourCard key={tour.slug} tour={tour} locale={locale} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
