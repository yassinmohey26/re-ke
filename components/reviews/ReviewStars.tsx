import styles from './Reviews.module.css';

interface ReviewStarsProps {
  rating: number;
  label: string;
  large?: boolean;
}

export default function ReviewStars({
  rating,
  label,
  large = false,
}: ReviewStarsProps) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span
      className={`${styles.starRow} ${large ? styles.starRowLarge : ''}`}
      aria-label={label}
    >
      <span aria-hidden="true">{'★'.repeat(roundedRating)}</span>
      <span className={styles.emptyStars} aria-hidden="true">
        {'★'.repeat(5 - roundedRating)}
      </span>
    </span>
  );
}
