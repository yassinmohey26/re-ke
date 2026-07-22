import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default async function TourBreadcrumb({ name }: { name: string }) {
  const t = await getTranslations('nav');

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href="/" className={styles.breadcrumbLink}>{t('home')}</Link>
      <span className={styles.breadcrumbSep}>/</span>
      <Link href="/touren" className={styles.breadcrumbLink}>{t('tours')}</Link>
      <span className={styles.breadcrumbSep}>/</span>
      <span className={styles.breadcrumbCurrent}>{name}</span>
    </nav>
  );
}
