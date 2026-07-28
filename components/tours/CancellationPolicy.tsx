import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default async function CancellationPolicy() {
  const t = await getTranslations('tours');

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('cancellationTitle')}</h2>
      <div className={styles.cancellationText}>
        <p>{t.rich('cancellationText1', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
        <p>{t.rich('cancellationText2', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
      </div>
    </div>
  );
}
