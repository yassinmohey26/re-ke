import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';
import type { Discount } from '@/lib/data/tours';

interface Props {
  discount?: Discount | null;
}

export default async function TourDiscountTable({ discount }: Props) {
  const t = await getTranslations('tours');

  if (!discount?.childTiers || discount.childTiers.length === 0) return null;

  // Map known German DB strings → translation keys
  const labelMap: Record<string, string> = {
    '0–2 Jahre': t('child0to2'),
    '3–10 Jahre': t('child3to10'),
    'Ab 11 Jahre': t('child11plus'),
  };
  const priceMap: Record<string, string> = {
    'Kostenlos': t('childFree'),
    '50% Ermäßigung': t('childHalf'),
    'Voller Preis': t('childFull'),
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('childDiscounts')}</h2>
      <table className={styles.priceTable}>
        <thead>
          <tr>
            <th className={styles.priceTableCell}>{t('childDiscountsAge')}</th>
            <th className={styles.priceTableCellValue}>{t('childDiscountsPrice')}</th>
          </tr>
        </thead>
        <tbody>
          {discount.childTiers.map((tier, i) => (
            <tr key={i}>
              <td className={styles.priceTableCell}>{labelMap[tier.label] ?? tier.label}</td>
              <td className={styles.priceTableCellValue}>{priceMap[tier.price] ?? tier.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
