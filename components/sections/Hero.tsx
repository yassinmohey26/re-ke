'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

interface TrustStat {
  number: string;
  label: string;
}

export default function Hero({ trustStats = [] }: { trustStats?: TrustStat[] }) {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleScroll = () => {
      const y = window.scrollY;
      el.style.setProperty('--parallax-y', `${y * 0.35}px`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.hero} ref={heroRef} aria-label="Hero">
      <div className={styles.bg}>
        <video ref={videoRef} className={styles.bgVideo} autoPlay muted loop playsInline preload="auto">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h1 className={styles.headline}>
            {t('title')}
          </h1>
          <p className={styles.subtext}>{t('subtitle')}</p>
          <ul className={styles.checklist} aria-label={t('benefits')}>
            {[t('check1'), t('check2'), t('check3')].map((item) => (
              <li key={item} className={styles.checkItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Link href="/touren" className="btn btn--primary btn--lg">{t('cta')}</Link>
            <Link href="/kontakt" className={styles.ghostBtn}>
              {t('secondary')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          {trustStats.length > 0 && (
            <div className={styles.trust}>
              {trustStats.map((stat, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  {i > 0 && <div className={styles.trustDivider} />}
                  <div className={styles.trustItem}>
                    <span className={styles.trustNumber}>{stat.number}</span>
                    <span className={styles.trustLabel}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollDot} />
      </div>
    </section>
  );
}
