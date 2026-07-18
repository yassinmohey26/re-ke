'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './not-found.module.css';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>{t('common.noResults')}</h1>
        <p className={styles.desc}>
          {t('common.notFoundDesc')}
        </p>
        <div className={styles.links}>
          <Link href="/" className="btn btn--primary btn--lg">
            {t('nav.home')}
          </Link>
          <Link href="/touren" className="btn btn--outline btn--lg">
            {t('tours.pageTitle')}
          </Link>
          <Link href="/kontakt" className="btn btn--ghost">
            {t('contact.pageTitle')}
          </Link>
        </div>
      </div>
    </div>
  );
}
