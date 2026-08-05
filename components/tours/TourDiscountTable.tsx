import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';
import {
  formatAgeLabel,
  formatDiscountLabel,
  resolveChildDiscounts,
  type ChildDiscountLocale,
  type TourChildDiscount,
} from '@/lib/child-discounts';

interface Props {
  childDiscounts?: TourChildDiscount[] | null;
  locale: string;
}

export default async function TourDiscountTable({ childDiscounts, locale }: Props) {
  const t = await getTranslations('tours');
  const tiers = resolveChildDiscounts(childDiscounts ?? []);
  const loc = (locale in { de: 1, en: 1, ar: 1, fr: 1, hu: 1, ru: 1 } ? locale : 'de') as ChildDiscountLocale;

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
          {tiers.map((tier, i) => (
            <tr key={tier.id ?? i}>
              <td className={styles.priceTableCell}>{formatAgeLabel(tier, loc)}</td>
              <td className={styles.priceTableCellValue}>{formatDiscountLabel(tier, loc)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
