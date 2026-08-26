'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './CTA.module.css';

export default function CTA() {
  const t = useTranslations('homeCta');

  return (
    <section className={styles.section} aria-label={t('ariaLabel')}>
      <div className={styles.bg}>
        <Image
          src="/cta-red-sea-pier.png"
          alt={t('imageAlt')}
          fill
          className={styles.bgImg}
          quality={85}
          sizes="100vw"
        />
        <div className={styles.overlay} />
      </div>

      <div className="container">
        <div className={styles.content}>
          <p className={styles.desc}>
            {t('trustQuote')}
          </p>
          <h2 className={styles.title}>
            {t('trustMotto')}
          </h2>
        </div>
      </div>
    </section>
  );
}
