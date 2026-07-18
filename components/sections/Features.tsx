'use client';

import { useTranslations } from 'next-intl';
import styles from './Features.module.css';

const FEATURES_ICONS = [
  (
    <svg key="f1" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.5 4.5C13.46 4.5 4.5 13.46 4.5 24.5S13.46 44.5 24.5 44.5 44.5 35.54 44.5 24.5 35.54 4.5 24.5 4.5zm0 7a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm7 25.5H17.5v-3h6v-11h-3v-3h6v14h5v3z" fill="currentColor"/>
    </svg>
  ),
  (
    <svg key="f2" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.5 4L6.5 12v11c0 10.19 7.67 19.73 18 22 10.33-2.27 18-11.81 18-22V12L24.5 4zm0 7l12 5.33V23c0 6.87-5.07 13.39-12 15.6-6.93-2.21-12-8.73-12-15.6v-6.67L24.5 11z" fill="currentColor"/>
    </svg>
  ),
  (
    <svg key="f3" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.5 14.5h-3v-3c0-3.87-3.13-7-7-7s-7 3.13-7 7v3h-3c-1.93 0-3.5 1.57-3.5 3.5v21c0 1.93 1.57 3.5 3.5 3.5h20c1.93 0 3.5-1.57 3.5-3.5V18c0-1.93-1.57-3.5-3.5-3.5zm-10.5 14a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm-4-14v-3c0-2.21 1.79-4 4-4s4 1.79 4 4v3h-8z" fill="currentColor"/>
    </svg>
  ),
  (
    <svg key="f4" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.5 4.5c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm2 35.5h-4V22.5h4V40zm0-21.5h-4v-4h4v4z" fill="currentColor"/>
    </svg>
  ),
  (
    <svg key="f5" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.5 4.5L3.17 18.5l3.83 2.3V39.5h35V20.8l3.83-2.3L24.5 4.5zm0 5.6l17.5 10.9-17.5 10.5-17.5-10.5L24.5 10.1zm15.5 12.4v13h-7v-10h-7v10H12v-13l12.5-7.5 12.5 7.5z" fill="currentColor"/>
    </svg>
  ),
  (
    <svg key="f6" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.5 4.5c-11.05 0-20 8.95-20 20 0 5.82 2.49 11.06 6.46 14.79L24.5 44.5l13.54-5.21C42.01 35.56 44.5 30.32 44.5 24.5c0-11.05-8.95-20-20-20zm0 36-9.5-3.66A15.94 15.94 0 018.5 24.5C8.5 15.67 15.67 8.5 24.5 8.5s16 7.17 16 16c0 4.69-2.02 8.91-5.23 11.87L24.5 40.5z" fill="currentColor"/>
    </svg>
  ),
];

export default function Features() {
  const t = useTranslations('features');

  return (
    <section className={`section section--light ${styles.section}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-eyebrow">{t('eyebrow')}</span>
          <h2 className="section-title">
            {t('titlePart1')} <span className="text-accent">{t('titleAccent')}</span>
          </h2>
          <p className="section-desc">
            {t('desc')}
          </p>
        </div>

        {/* Cards grid */}
        <div className={styles.grid}>
          {['f1','f2','f3','f4','f5','f6'].map((key, i) => (
            <div key={key} className={styles.card}>
              <div className={styles.iconWrap}>
                {FEATURES_ICONS[i]}
              </div>
              <h3 className={styles.cardTitle}>{t(`${key}Title`)}</h3>
              <p className={styles.cardDesc}>{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
