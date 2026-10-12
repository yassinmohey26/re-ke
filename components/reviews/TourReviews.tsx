import { getTranslations } from 'next-intl/server';
import {
  summarizeReviews,
  type TourReview,
} from '@/lib/data/reviews';
import ReviewStars from './ReviewStars';
import styles from './Reviews.module.css';

interface TourReviewsProps {
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

function formatTravelDate(date: string | null, locale: string): string {
  if (!date) return '';

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export default async function TourReviews({
  reviews,
  locale,
}: TourReviewsProps) {
  if (reviews.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'reviews' });
  const summary = summarizeReviews(reviews);

  return (
    <section className={styles.tourSection} aria-labelledby="tour-reviews">
      <div className={styles.sectionHeading}>
        <span className={styles.eyebrow}>{t('eyebrow')}</span>
        <h2 id="tour-reviews">{t('tourTitle')}</h2>
        <p>{t('tourSubtitle')}</p>
      </div>

      {reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">☆</span>
          <p>{t('noReviews')}</p>
        </div>
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.scoreCard}>
              <strong>{summary.average.toFixed(1)}</strong>
              <ReviewStars
                rating={summary.average}
                large
                label={t('ratingLabel', { rating: summary.average })}
              />
              <span>{t('basedOn', { count: summary.total })}</span>
            </div>

            <div className={styles.breakdown}>
              {[5, 4, 3, 2, 1].map(rating => {
                const count =
                  summary.breakdown[rating as 1 | 2 | 3 | 4 | 5];
                const percentage = summary.total
                  ? (count / summary.total) * 100
                  : 0;

                return (
                  <div key={rating} className={styles.breakdownRow}>
                    <span>{rating}</span>
                    <span className={styles.smallStar} aria-hidden="true">
                      ★
                    </span>
                    <span className={styles.breakdownTrack}>
                      <span style={{ width: `${percentage}%` }} />
                    </span>
                    <span className={styles.breakdownCount}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.tourReviewGrid}>
            {reviews.map(review => {
              const flag = countryFlag(review.countryCode);
              const travelDate = formatTravelDate(
                review.travelDate,
                locale,
              );

              return (
                <article key={review.id} className={styles.tourReviewCard}>
                  <div className={styles.quoteMark} aria-hidden="true">
                    “
                  </div>

                  <ReviewStars
                    rating={review.rating}
                    label={t('ratingLabel', { rating: review.rating })}
                  />

                  {review.title && <h3>{review.title}</h3>}
                  <blockquote>{review.body}</blockquote>

                  <footer className={styles.reviewFooter}>
                    {review.guestImage ? (
                      <img
                        className={styles.avatar}
                        src={review.guestImage}
                        alt=""
                      />
                    ) : (
                      <span className={styles.avatarFallback}>
                        {review.guestName.charAt(0).toUpperCase()}
                      </span>
                    )}

                    <span className={styles.guestDetails}>
                      <strong>{review.guestName}</strong>
                      <span>
                        {flag && <span aria-hidden="true">{flag} </span>}
                        {review.guestCountry}
                      </span>

                      {travelDate && (
                        <small>{t('traveled', { date: travelDate })}</small>
                      )}
                    </span>

                    {review.isVerified && (
                      <span className={styles.verifiedBadge}>
                        <span aria-hidden="true">✓</span>
                        {t('verified')}
                      </span>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
