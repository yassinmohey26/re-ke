'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useTourBooking } from './TourBookingContext';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

interface Props {
  duration: string;
  meetingPoint: string;
  category: string;
  categoryLabel: string;
}

export default function TourPriceTable({ duration, meetingPoint, category, categoryLabel }: Props) {
  const t = useTranslations('tours');
  const { pricePerPerson, salePricePerPerson, hasSale } = useTourBooking();

  let priceDisplay: string | React.ReactNode = t('requestOnly');
  if (salePricePerPerson != null) {
    if (hasSale && pricePerPerson != null) {
      priceDisplay = (
        <><span className={styles.saleOriginalPrice}>{pricePerPerson} EUR</span> <span className={styles.salePrice}>{salePricePerPerson} EUR</span></>
      );
    } else {
      priceDisplay = `${salePricePerPerson} EUR`;
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
