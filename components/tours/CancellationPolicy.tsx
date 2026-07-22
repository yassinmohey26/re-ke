import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default async function CancellationPolicy() {
  const t = await getTranslations('tours');

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('cancellationTitle')}</h2>
      <div className={styles.cancellationText}>
        <p>{t('cancellationText1')}</p>
        <p>{t('cancellationText2')}</p>
      </div>
    </div>
  );
}
