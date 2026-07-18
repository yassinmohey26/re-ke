'use client';

import { Link } from '@/i18n/navigation';
import styles from './FaqContactCard.module.css';

interface Props {
  heading: string;
  quote: string;
  buttonText: string;
}

export default function FaqContactCard({ heading, quote, buttonText }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h3 className={styles.heading}>{heading}</h3>
      <p className={styles.quote}>{quote}</p>
      <Link href="/kontakt" className={styles.btn}>
        {buttonText}
      </Link>
    </div>
  );
}
