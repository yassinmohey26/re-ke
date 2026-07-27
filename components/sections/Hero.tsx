'use client';

import { Link } from '@/i18n/navigation';
import { useEffect, useRef } from 'react';
import { KineticText } from '@/components/ui/kinetic-text';
import styles from './Hero.module.css';

interface TrustStat {
  number: string;
  label: string;
}

interface HeroProps {
  trustStats?: TrustStat[];
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  secondary: string;
  check1: string;
  check2: string;
  check3: string;
  benefits: string;
}

export default function Hero({
  trustStats = [],
  eyebrow, title, subtitle, cta, secondary, check1, check2, check3, benefits,
}: HeroProps) {
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
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.headline}>
            <KineticText text={title} as="span" />
          </h1>
          <p className={styles.subtext}>{subtitle}</p>
          <ul className={styles.checklist} aria-label={benefits}>
            {[check1, check2, check3].map((item) => (
              <li key={item} className={styles.checkItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Link href="/touren" className="btn btn--primary btn--lg">{cta}</Link>
            <Link href="/kontakt" className={styles.ghostBtn}>
              {secondary}
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
