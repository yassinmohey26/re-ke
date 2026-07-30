'use client';

import { useTranslations } from 'next-intl';
import { useTourBooking } from './TourBookingContext';
import { applyDiscount } from '@/lib/pricing-table';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default function InteractivePricingTable() {
  const t = useTranslations('tours');
  const { pricingTiers, guestsForPricing, discount } = useTourBooking();

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
            {pricingTiers.map((tier, i) => {
              const salePrice = discount?.active ? applyDiscount(tier.pricePerPerson, discount, i) : null;
              const hasSale = salePrice != null && salePrice < tier.pricePerPerson;
              return (
                <tr
                  key={i}
                  className={`${styles.pricingRow} ${isTierActive(tier.minGuests, tier.maxGuests) ? styles.pricingRowActive : ''}`}
                >
                  <td className={styles.pricingCellGuests}>
                    {tier.minGuests === tier.maxGuests
                      ? `${tier.minGuests} ${tier.minGuests === 1 ? t('person') : t('persons')}`
                      : `${tier.minGuests}–${tier.maxGuests} ${t('persons')}`}
                  </td>
                  <td className={styles.pricingCellPrice}>
                    {hasSale ? (
                      <>
                        <span className={styles.saleOriginalPrice}>{tier.pricePerPerson} €</span>{' '}
                        <span className={styles.salePrice}>{salePrice} €</span>
                      </>
                    ) : tier.pricePerPerson === 0 ? t('free') : `${tier.pricePerPerson} €`}
                    {isTierActive(tier.minGuests, tier.maxGuests) && (
                      <span className={styles.pricingActiveLabel}>{t('yourPrice')}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
