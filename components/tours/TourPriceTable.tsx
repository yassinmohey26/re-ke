import React from 'react';
import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

interface Props {
  price: number | null;
  duration: string;
  meetingPoint: string;
  category: string;
  categoryLabel: string;
  discount?: { active: boolean; percentage: number } | null;
}

export default async function TourPriceTable({ price, duration, meetingPoint, category, categoryLabel, discount }: Props) {
  const t = await getTranslations('tours');

  let priceDisplay: string | React.ReactNode = t('requestOnly');
  if (price != null) {
    if (discount?.active) {
      const salePrice = Math.round(price * (1 - discount.percentage / 100));
      priceDisplay = (
        <><span className={styles.saleOriginalPrice}>{price} EUR</span> <span className={styles.salePrice}>{salePrice} EUR</span></>
      );
    } else {
      priceDisplay = `${price} EUR`;
    }
  }

  const rows = [
    { label: t('priceTablePrice'), value: priceDisplay },
    { label: t('priceTableType'), value: categoryLabel },
    { label: t('priceTableDuration'), value: duration },
    { label: t('priceTableCollection'), value: meetingPoint },
  ];

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('priceTableTitle')}</h2>
      <table className={styles.priceTable}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className={styles.priceTableCell}>{row.label}</td>
              <td className={styles.priceTableCellValue}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
