import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default async function TrustBox() {
  const t = await getTranslations('tours');

  const reasons = [
    t('trust1'),
    t('trust2'),
    t('trust3'),
    t('trust4'),
    t('trust5'),
  ];

  return (
    <div className={styles.trustBox}>
      <h3 className={styles.trustTitle}>{t('trustTitle')}</h3>
      <ul className={styles.trustList}>
        {reasons.map((reason) => (
          <li key={reason} className={styles.trustItem}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-tone-green)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
