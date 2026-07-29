import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';
import type { Discount } from '@/lib/data/tours';

export default async function ChildDiscountTable({ discount }: { discount: Discount | null }) {
  const t = await getTranslations('tours');

  if (!discount?.childTiers || discount.childTiers.length === 0) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('childDiscountTitle')}</h2>
      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th className={styles.priceTableCell}>{t('childDiscountAge')}</th>
            <th className={styles.priceTableCellValue}>{t('childDiscountPrice')}</th>
          </tr>
        </thead>
        <tbody>
          {discount.childTiers.map((tier, i) => (
            <tr key={i}>
              <td className={styles.priceTableCell}>{tier.label}</td>
              <td className={styles.priceTableCellValue}>{tier.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
