'use client';

import { Handshake, Percent, Heart, Gem } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './Features.module.css';

const AMBER = '#F59E0B';
const BLUE = '#155fa7';
const GREY = '#718096';

function CoffeeFilled() {
  return (
    <svg viewBox="0 0 24 24" fill={AMBER} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 8H5.5C4.4 8 3.5 8.9 3.5 10v2c0 3.3 2.7 6 6 6h2c3.3 0 6-2.7 6-6v-2c0-1.1-.9-2-2-2zm0 4c0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4v-2h10v2zM5.5 4h2v2h-2zM9.5 4h2v2h-2zM13.5 4h2v2h-2zM18.5 15c-.8 0-1.5.7-1.5 1.5 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.8-.7-1.5-1.5-1.5z"/>
      <path d="M2.5 20h19v2h-19z"/>
    </svg>
  );
}

function CustomAStar() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="4" fill={AMBER}/>
      <text x="12" y="18" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">A</text>
      <rect x="26" y="2" width="20" height="20" rx="4" fill={AMBER}/>
      <path d="M36 6l1.5 4.5H42l-3.5 2.5 1.5 4.5L36 15l-4 2.5 1.5-4.5L30 10.5h4.5L36 6z" fill="white"/>
    </svg>
  );
}

const FEATURES = [
  { icon: Handshake, titleKey: 'f1Title', descKey: 'f1Desc', outline: true },
  { icon: CoffeeFilled, titleKey: 'f2Title', descKey: 'f2Desc', outline: false },
  { icon: CustomAStar, titleKey: 'f3Title', descKey: 'f3Desc', outline: false },
  { icon: Percent, titleKey: 'f4Title', descKey: 'f4Desc', outline: true },
  { icon: Heart, titleKey: 'f5Title', descKey: 'f5Desc', outline: true },
  { icon: Gem, titleKey: 'f6Title', descKey: 'f6Desc', outline: true },
];

export default function Features() {
  const t = useTranslations('features');

  return (
    <section className={`section section--light ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>{t('titlePart1')}</h2>
        </div>

        <div className={styles.grid}>
          {FEATURES.map(({ icon: Icon, titleKey, descKey, outline }) => (
            <div key={titleKey} className={styles.card}>
              <div className={styles.iconWrap} style={{ color: AMBER }}>
                <Icon stroke={outline ? AMBER : undefined} fill={outline ? 'none' : undefined} />
              </div>
              <h3 className={styles.cardTitle} style={{ color: BLUE }}>{t(titleKey)}</h3>
              <p className={styles.cardDesc} style={{ color: GREY }}>{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
