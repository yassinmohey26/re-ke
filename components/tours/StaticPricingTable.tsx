import { getPricingLabels, formatParticipantLabel, formatPrice, getVehicleLabel, type Locale } from '@/lib/data/pricing-labels';
import type { PricingTierEntry } from '@/lib/data/tours';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

interface Props {
  tiers: PricingTierEntry[];
  locale: Locale;
}

export default function StaticPricingTable({ tiers, locale }: Props) {
  const labels = getPricingLabels(locale);
  const hasVehicle = tiers.some(t => t.vehicle != null);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{labels.header_price}</h2>
      <table className={styles.priceTable} dir={dir}>
        <thead>
          <tr>
            <th className={styles.priceTableCell}>{labels.header_participants}</th>
            {hasVehicle && <th className={styles.priceTableCell}>{labels.header_vehicle}</th>}
            <th className={styles.priceTableCellValue}>{labels.header_price}</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => (
            <tr key={i}>
              <td className={styles.priceTableCell}>{formatParticipantLabel(tier.min, tier.max, labels)}</td>
              {hasVehicle && <td className={styles.priceTableCell}>{tier.vehicle ? getVehicleLabel(tier.vehicle, labels) : ''}</td>}
              <td className={styles.priceTableCellValue}>{formatPrice(tier.price, labels)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
