import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default async function ChildDiscountTable() {
  const t = await getTranslations('tours');

  const tiers = [
    { age: t('childAge04'), price: t('childPriceFree') },
    { age: t('childAge511'), price: t('childPriceDiscount') },
    { age: t('childAge12'), price: t('childPriceFull') },
  ];

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
          {tiers.map((tier) => (
            <tr key={tier.age}>
              <td className={styles.priceTableCell}>{tier.age}</td>
              <td className={styles.priceTableCellValue}>{tier.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
