import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './TourCard.module.css';
import type { Tour } from '@/lib/data/tours';

export default async function TourCard({
  tour,
  locale = 'de',
  name,
  description,
  categoryLabel,
}: {
  tour: Tour;
  locale?: string;
  name?: string;
  description?: string;
  categoryLabel?: string;
}) {
  const t = await getTranslations('tours');
  const tCommon = await getTranslations('common');
  const displayName = name ?? tour.name;
  const displayDesc = description ?? tour.shortDescription;
  const displayCat = categoryLabel ?? tour.categoryLabel;

  return (
    <article className={styles.card}>
      <Link href={`/touren/${tour.slug}`} className={styles.imgLink}>
        <div className={styles.imgWrap}>
          {tour.image && tour.image.startsWith('http') ? (
            <Image
              src={tour.image}
              alt={displayName}
              fill
              className={styles.img}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--color-accent)' }} />
          )}
          <span className={styles.categoryBadge}>{displayCat}</span>
        </div>
      </Link>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.destination}>{tour.destination}</span>
          <span className={styles.dot}>·</span>
          <span>{tour.duration}</span>
        </div>
        <h3 className={styles.title}>
          <Link href={`/touren/${tour.slug}`}>{displayName}</Link>
        </h3>
        <p className={styles.desc}>{displayDesc}</p>
        <div className={styles.footer}>
          {tour.price ? (
            <span className={styles.price}>{t('from')} {tour.price} EUR</span>
          ) : (
            <span className={styles.price}>{t('requestOnly')}</span>
          )}
          <div className={styles.actions}>
            <Link href={`/booking?tour=${tour.slug}`} className={styles.bookLink}>
              {tCommon('bookNow')}
            </Link>
            <Link href={`/touren/${tour.slug}`} className={styles.detailsLink}>
              {tCommon('details')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
