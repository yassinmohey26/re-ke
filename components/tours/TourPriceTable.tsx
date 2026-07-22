import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

interface Props {
  price: number | null;
  duration: string;
  meetingPoint: string;
  category: string;
  categoryLabel: string;
}

export default async function TourPriceTable({ price, duration, meetingPoint, categoryLabel }: Props) {
  const t = await getTranslations('tours');

  const rows = [
    { label: t('priceTablePrice'), value: price != null ? `${price} EUR` : t('requestOnly') },
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
