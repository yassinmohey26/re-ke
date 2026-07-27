'use client';

import { useTranslations } from 'next-intl';
import { useTourBooking } from './TourBookingContext';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default function InteractivePricingTable() {
  const t = useTranslations('tours');
  const { pricingTiers, guestsForPricing } = useTourBooking();

  if (pricingTiers.length === 0) return null;

  function isTierActive(min: number, max: number) {
    return guestsForPricing >= min && guestsForPricing <= max;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('pricingTitle')}</h2>
      <div className={styles.pricingTableWrapper}>
        <table className={styles.interactivePricingTable}>
          <thead>
            <tr>
              <th>{t('participants')}</th>
              <th>{t('pricePerPersonCol')}</th>
            </tr>
          </thead>
          <tbody>
            {pricingTiers.map((tier, i) => (
              <tr
                key={i}
                className={`${styles.pricingRow} ${isTierActive(tier.minGuests, tier.maxGuests) ? styles.pricingRowActive : ''}`}
              >
                <td className={styles.pricingCellGuests}>
                  {tier.minGuests === tier.maxGuests
                    ? `${tier.minGuests} ${tier.minGuests === 1 ? 'Person' : 'Personen'}`
                    : `${tier.minGuests}–${tier.maxGuests} Personen`}
                </td>
                <td className={styles.pricingCellPrice}>
                  {tier.pricePerPerson === 0 ? t('free') : `${tier.pricePerPerson} €`}
                  {isTierActive(tier.minGuests, tier.maxGuests) && (
                    <span className={styles.pricingActiveLabel}>{t('yourPrice')}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
