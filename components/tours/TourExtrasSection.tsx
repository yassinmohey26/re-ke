'use client';

import { useTranslations } from 'next-intl';
import { useTourBooking } from './TourBookingContext';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default function TourExtrasSection() {
  const t = useTranslations('tours');
  const { extras, selected, toggle } = useTourBooking();

  if (extras.length === 0) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('extras')}</h2>
      <p style={{ fontSize: 14, color: 'var(--color-text-5)', marginBottom: 'var(--space-4)' }}>
        {t('extrasDescription')}
      </p>
      <div className={styles.extrasList}>
        {extras.map((extra) => (
          <label key={extra.id} className={styles.extraItem}>
            <input
              type="checkbox"
              checked={selected.includes(extra.id)}
              onChange={() => toggle(extra.id)}
              className={styles.extraCheckbox}
            />
            <div className={styles.extraInfo}>
              <span className={styles.extraName}>{extra.name}</span>
              {extra.description && (
                <span className={styles.extraDesc}>{extra.description}</span>
              )}
            </div>
            <span className={styles.extraPrice}>+{extra.price.toFixed(0)} EUR</span>
          </label>
        ))}
      </div>
    </div>
  );
}
