'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import styles from './CTA.module.css';

export default function CTA() {
  const t = useTranslations('homeCta');
  const tCommon = useTranslations('common');

  return (
    <section className={styles.section} aria-label={t('eyebrow')}>
      {/* Background */}
      <div className={styles.bg}>
        <Image
          src="https://hurghada-reiseplaner.at/wp-content/uploads/2025/10/f0387742-800px-wm.jpg"
          alt="Rotes Meer Hurghada"
          fill
          className={styles.bgImg}
          quality={85}
          sizes="100vw"
        />
        <div className={styles.overlay} />
      </div>

      <div className="container">
        <div className={styles.content}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h2 className={styles.title}>
            {t('title')}
          </h2>
          <p className={styles.desc}>
            {t('desc')}
          </p>
          <div className={styles.actions}>
            <Link href="/touren" className={styles.btnPrimary}>
              {t('primary')}
            </Link>
            <Link href="/kontakt" className={styles.btnOutline}>
              {t('secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
