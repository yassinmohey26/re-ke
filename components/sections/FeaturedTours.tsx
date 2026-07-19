import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import TourCard from '@/components/cards/TourCard';
import { getLocalizedAllTours } from '@/lib/data/tours';

export default async function FeaturedTours({ locale }: { locale: string }) {
  const t = await getTranslations('homeFeatured');
  const allTours = await getLocalizedAllTours(locale);
  const tours = allTours.filter((tour) => tour.featured);

  if (tours.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-6)', marginBottom: 'var(--space-10)', flexWrap: 'wrap' }}>
          <div>
            <span className="section-eyebrow">{t('eyebrow')}</span>
            <h2 className="section-title">
              {t('titlePart1')} <span className="text-accent">{t('titleAccent')}</span>
            </h2>
          </div>
          <Link href="/touren" className="btn btn--ghost">
            {t('viewAll')}
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {tours.slice(0, 6).map((tour) => (
            <TourCard key={tour.slug} tour={tour} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
