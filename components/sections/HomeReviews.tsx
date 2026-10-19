import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { TourReview } from '@/lib/data/reviews';
import ReviewStars from '@/components/reviews/ReviewStars';
import ReviewCarousel from '@/components/reviews/ReviewCarousel';
import styles from '@/components/reviews/Reviews.module.css';

interface HomeReviewsProps {
  reviews: TourReview[];
  locale: string;
}

function countryFlag(countryCode: string): string {
  if (!/^[A-Z]{2}$/.test(countryCode)) return '';

  return String.fromCodePoint(
    ...countryCode
      .split('')
      .map(character => 127397 + character.charCodeAt(0)),
  );
}

export default async function HomeReviews({
  reviews,
  locale,
}: HomeReviewsProps) {
  if (reviews.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'reviews' });

  return (
    <section className={styles.homeSection}>
      <div className="container">
        <div className={styles.homeHeading}>
          <div>
            <span className={styles.eyebrow}>{t('eyebrow')}</span>
            <h2>{t('homepageTitle')}</h2>
          </div>
          <p>{t('homepageSubtitle')}</p>
        </div>

        <ReviewCarousel previousLabel={t('previous')} nextLabel={t('next')} label={t('homepageTitle')}>
          {reviews.map(review => (
            <article key={review.id} className={styles.homeReviewCard}>
              <div className={styles.homeCardTop}>
                <ReviewStars
                  rating={review.rating}
                  label={t('ratingLabel', { rating: review.rating })}
                />

                <span className={styles.homeQuoteMark} aria-hidden="true">
                  “
                </span>
              </div>

              {review.title && <h3>{review.title}</h3>}
              <blockquote>{review.body}</blockquote>

              <footer className={styles.homeCardFooter}>
                <span className={styles.homeGuest}>
                  {review.guestImage ? (
                    <img src={review.guestImage} alt="" />
                  ) : (
                    <span className={styles.homeGuestFallback}>
                      {review.guestName.charAt(0).toUpperCase()}
                    </span>
                  )}

                  <span className={styles.homeGuestDetails}>
                    <strong>
                      {review.guestName}
                      {review.countryCode && (
                        <>
                          {' '}
                          <span aria-hidden="true">
                            {countryFlag(review.countryCode)}
                          </span>
                        </>
                      )}
                    </strong>

                    <small>
                      {review.isVerified
                        ? `✓ ${t('verified')}`
                        : review.guestCountry}
                    </small>
                  </span>
                </span>

                {review.reviewType === 'company' && <span className={styles.reviewScope}>{t('companyLabel')}</span>}
                {review.reviewType === 'transfer' && (
                  <Link className={styles.homeTourLink} href="/airport-transfer">{t('transferLabel')}</Link>
                )}
                {review.tours.map(tour => (
                  <Link
                    key={tour.id}
                    className={styles.homeTourLink}
                    href={`/touren/${tour.slug}`}
                    title={tour.name}
                  >
                    <span>{tour.name}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </footer>
            </article>
          ))}
        </ReviewCarousel>
      </div>
    </section>
  );
}
