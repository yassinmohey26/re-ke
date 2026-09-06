import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { createBookingSchema, type BookingFormData } from '@/lib/validations';
import { submitBooking } from '@/lib/actions';
import { type PricingTier, getPriceForGuests } from '@/lib/pricing-table';
import CheckoutButton from '@/components/checkout/CheckoutButton';
import type { ParticipantPrice } from '@/lib/participant-pricing';
import { calculateTransferSurcharge } from '@/lib/transfer-pricing';
import { getBookingAgeLabels, type TourChildDiscount, type ChildDiscountLocale } from '@/lib/child-discounts';
import styles from './BookingForm.module.css';

// Extend BookingFormData to make paymentOption required
type BookingFormDataWithPayment = Omit<BookingFormData, 'paymentOption'> & {
  paymentOption: 'full' | 'deposit';
};

function getTodayLocalDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Discount {
  active: boolean;
  percentage: number;
  tierPrices?: number[];
  childTiers?: { label: string; price: string }[];
}

interface BookingFormProps {
  tourSlug: string;
  tourName: string;
  pricePerPerson?: number | null;
  maxGuests?: number;
  pricingTiers?: PricingTier[];
  discount?: Discount | null;
  childDiscounts?: TourChildDiscount[];
  extras?: Extra[];
  destinations?: { slug: string; name: string }[];
  initialSelectedExtraIds?: string[];
  initialDate?: string;
  initialAdults?: number;
  initialChildren?: number;
  initialInfants?: number;
  participantPrices?: Partial<Record<'adult' | 'child' | 'infant', ParticipantPrice>>;
}

function GuestCounter({
  label,
  subtitle,
  count,
  min,
  max,
  onIncrease,
  onDecrease,
  css,
}: {
  label: string;
  subtitle: string;
  count: number;
  min: number;
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
  css: typeof styles;
}) {
  return (
    <div className={css.guestRow}>
      <div className={css.guestInfo}>
        <span className={css.guestLabel}>{label}</span>
        <span className={css.guestSubtitle}>{subtitle}</span>
      </div>
      <div className={css.guestPicker}>
        <button type="button" className={css.guestBtn} onClick={onDecrease} disabled={count <= min}>−</button>
        <span className={css.guestCount}>{count}</span>
        <button type="button" className={css.guestBtn} onClick={onIncrease} disabled={count >= max}>+</button>
      </div>
    </div>
  );
}

export default function BookingForm({
  tourSlug,
  tourName,
  pricePerPerson,
  maxGuests = 8,
  pricingTiers = [],
  discount = null,
  childDiscounts = [],
  extras = [],
  destinations = [],
  initialSelectedExtraIds = [],
  initialDate = '',
  initialAdults = 2,
  initialChildren = 0,
  initialInfants = 0,
  participantPrices = {},
}: BookingFormProps) {
  const t = useTranslations('booking');
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>(initialSelectedExtraIds);
  const [adults, setAdults] = useState(initialAdults);
  const [childrenCount, setChildrenCount] = useState(initialChildren);
  const [infants, setInfants] = useState(initialInfants);
  const [paymentOption, setPaymentOption] = useState<'full' | 'deposit'>('full');
  const [hotelName, setHotelName] = useState('');
  const [hotelRegion, setHotelRegion] = useState('');
  const minimumDate = getTodayLocalDate();

  const ageLabels = getBookingAgeLabels(childDiscounts, (locale in { de: 1, en: 1, ar: 1, fr: 1, hu: 1, ru: 1 } ? locale : 'de') as ChildDiscountLocale);

  const guestsTotal = adults + childrenCount + infants;
  const hasFixedChildPricing = discount?.childTiers != null && discount.childTiers.length >= 2;
  const guestsForPricing = hasFixedChildPricing ? adults : adults + childrenCount;

  const bookingSchema = useMemo(
    () => createBookingSchema({
      firstNameMin: t('validation.firstNameMin'),
      firstNameMax: t('validation.firstNameMax'),
      lastNameMin: t('validation.lastNameMin'),
      lastNameMax: t('validation.lastNameMax'),
      emailInvalid: t('validation.emailInvalid'),
      phoneMin: t('validation.phoneMin'),
      phoneMax: t('validation.phoneMax'),
      dateInvalid: t('validation.dateInvalid'),
      guestsMin: t('validation.guestsMin'),
      guestsMax: t('validation.guestsMax'),
      messageMax: t('validation.messageMax'),
    }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingFormDataWithPayment>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tourSlug,
      tourName,
      date: initialDate,
      guests: guestsTotal,
      adults: initialAdults,
      children: initialChildren,
      infants: initialInfants,
      paymentOption: 'full',
    },
  });

  const dynamicPricePerPerson = participantPrices.adult?.price ?? getPriceForGuests(pricingTiers, pricePerPerson ?? null, guestsForPricing);

  function toggleExtra(id: string) {
    setSelectedExtraIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const selectedExtras = extras.filter((e) => selectedExtraIds.includes(e.id));
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0) * guestsForPricing;

  // Display-only surcharge using the same shared server rules the booking and
  // Stripe checkout recalculate. Only the region slug is ever submitted.
  const transferSurcharge = calculateTransferSurcharge(hotelRegion, { adult: adults, child: childrenCount, infant: infants })?.subtotal ?? 0;

  const parsePrice = (s: string) => {
    const m = s.match(/[\d,.]+/);
    return m ? parseFloat(m[0].replace(',', '.')) : null;
  };
  const childTiers = discount?.childTiers;
  const hasChildTiers = childTiers && childTiers.length >= 2;
  const totalPrice = dynamicPricePerPerson != null
    ? (() => {
        const adultTotal = dynamicPricePerPerson * adults;
        if (hasChildTiers) {
          const childPrice = parsePrice(childTiers[1].price);
          const infantPrice = parsePrice(childTiers[0].price);
          return adultTotal
            + (childrenCount && (participantPrices.child?.price ?? childPrice) != null ? (participantPrices.child?.price ?? childPrice)! * childrenCount : (dynamicPricePerPerson / 2) * childrenCount)
            + (infants && (participantPrices.infant?.price ?? infantPrice) != null ? (participantPrices.infant?.price ?? infantPrice)! * infants : 0)
            + extrasTotal + transferSurcharge;
        }
        return adultTotal + (dynamicPricePerPerson / 2) * childrenCount + extrasTotal + transferSurcharge;
      })()
    : null;

  const depositAmount = totalPrice != null ? Math.round(totalPrice * 0.3 * 100) / 100 : null;
  const remainingAmount = totalPrice != null && depositAmount != null ? totalPrice - depositAmount : null;

  const adultsMax = maxGuests - childrenCount - infants;
  const childrenMax = maxGuests - adults - infants;
  const infantsMax = maxGuests - adults - childrenCount;

  const onSubmit = (data: BookingFormDataWithPayment) => {
    setServerError('');
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });
      fd.append('tourSlug', tourSlug);
      fd.append('tourName', tourName);
      fd.append('guests', String(guestsTotal));
      fd.append('adults', String(adults));
      fd.append('children', String(childrenCount));
      fd.append('infants', String(infants));
      fd.append('locale', locale);
      // Store guest breakdown in extras
      const guestBreakdown = [
        { id: '_adults', name: `Erwachsene (${adults})`, price: 0 },
        ...(childrenCount > 0 ? [{ id: '_children', name: `Kinder (${childrenCount})`, price: 0 }] : []),
        ...(infants > 0 ? [{ id: '_infants', name: `Kleinkind (${infants})`, price: 0 }] : []),
      ];
      const allExtras = [...guestBreakdown, ...selectedExtras];
      fd.append('extrasJson', JSON.stringify(allExtras));
      if (hotelName) fd.append('hotelName', hotelName);
      if (hotelRegion) fd.append('hotelRegion', hotelRegion);
      const result = await submitBooking(fd);
      if (result.success) {
        setSuccess(true);
        reset();
      } else {
        setServerError(result.error ?? t('errorDefault'));
      }
    });
  };

  if (success) {
    return (
      <div className={styles.success} role="alert">
        <div className={styles.successIcon}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-tone-green)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>{t('successSent')}</h3>
        <p className={styles.successText}>{t('successSentDesc')}</p>
        <button className="btn btn--outline" onClick={() => setSuccess(false)}>
          {t('newBooking')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.field}>
        <label htmlFor="booking-firstName" className={styles.label}>
          {t('firstName')} <span aria-hidden>*</span>
        </label>
        <input
          id="booking-firstName"
          type="text"
          autoComplete="given-name"
          placeholder={t('placeholderFirstName')}
          className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
          {...register('firstName')}
        />
        {errors.firstName && <span className={styles.errorText}>{errors.firstName.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="booking-lastName" className={styles.label}>
          {t('lastName')} <span aria-hidden>*</span>
        </label>
        <input
          id="booking-lastName"
          type="text"
          autoComplete="family-name"
          placeholder={t('placeholderLastName')}
          className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
          {...register('lastName')}
        />
        {errors.lastName && <span className={styles.errorText}>{errors.lastName.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="booking-email" className={styles.label}>
          {t('email')} <span aria-hidden>*</span>
        </label>
        <input
          id="booking-email"
          type="email"
          autoComplete="email"
          placeholder={t('placeholderEmail')}
          className={`${styles.input} ${errors.email ? styles.error : ''}`}
          {...register('email')}
        />
        {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="booking-phone" className={styles.label}>
          {t('phone')} <span aria-hidden>*</span>
        </label>
        <input
          id="booking-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+43 681 811 400 99"
          className={`${styles.input} ${errors.phone ? styles.error : ''}`}
          {...register('phone')}
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="booking-date" className={styles.label}>
          {t('date')} <span aria-hidden>*</span>
        </label>
        <input
          id="booking-date"
          type="date"
          min={minimumDate}
          className={`${styles.input} ${errors.date ? styles.error : ''}`}
          {...register('date')}
        />
        {errors.date && <span className={styles.errorText}>{errors.date.message}</span>}
      </div>

      {/* Guest Category Pickers */}
      <div className={styles.field}>
        <label className={styles.label}>{t('guests')} ({guestsTotal}/{maxGuests})</label>
        <GuestCounter
          label={t('adults')}
          subtitle={ageLabels.adults}
          count={adults}
          min={0}
          max={adultsMax}
          onIncrease={() => setAdults(Math.min(maxGuests, adults + 1))}
          onDecrease={() => setAdults(Math.max(0, adults - 1))}
          css={styles}
        />
        <GuestCounter
          label={t('children')}
          subtitle={ageLabels.children}
          count={childrenCount}
          min={0}
          max={childrenMax}
          onIncrease={() => setChildrenCount(Math.min(maxGuests, childrenCount + 1))}
          onDecrease={() => setChildrenCount(Math.max(0, childrenCount - 1))}
          css={styles}
        />
        <GuestCounter
          label={t('infant')}
          subtitle={ageLabels.infants}
          count={infants}
          min={0}
          max={infantsMax}
          onIncrease={() => setInfants(Math.min(maxGuests, infants + 1))}
          onDecrease={() => setInfants(Math.max(0, infants - 1))}
          css={styles}
        />
        {guestsTotal < 1 && (
          <span className={styles.errorText}>{t('minGuestsRequired')}</span>
        )}
        <input type="hidden" {...register('guests')} value={guestsTotal} />
      </div>

      <div className={styles.field}>
        <label htmlFor="booking-message" className={styles.label}>{t('message')}</label>
        <textarea
          id="booking-message"
          placeholder={t('messagePlaceholder')}
          rows={3}
          className={styles.textarea}
          {...register('message')}
        />
      </div>

      {/* Transfer / Hotelregion Card */}
      <div className={styles.transferCard}>
        <div className={styles.transferCardTitle}>
          <svg className={styles.transferCardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17h1m0 0a2 2 0 104 0m-4 0a2 2 0 114 0m6-1h1m0 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            <path d="M5 17H3V6a1 1 0 011-1h9v12M14 7h2l3 4v6h-2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
          {t('transferTitle')}
        </div>
        <div className={styles.transferCardFields}>
          <div className={styles.transferCardRow}>
            <div className={styles.field}>
              <label htmlFor="booking-hotel-name" className={styles.label}>{t('hotelName')}</label>
              <input
                id="booking-hotel-name"
                type="text"
                value={hotelName}
                onChange={e => setHotelName(e.target.value)}
                placeholder={t('hotelNamePlaceholder')}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="booking-hotel-region" className={styles.label}>{t('hotelRegion')}</label>
              <select
                id="booking-hotel-region"
                value={hotelRegion}
                onChange={e => setHotelRegion(e.target.value)}
                className={styles.input}
              >
                <option value="">{t('hotelRegionPlaceholder')}</option>
                <option value="hurghada">{t('regionHurghada')}</option>
                <option value="makadi-bay">{t('regionMakadiBay')}</option>
                <option value="sahl-hasheesh">{t('regionSahlHasheesh')}</option>
                <option value="el-gouna">{t('regionElGouna')}</option>
                <option value="soma-bay">{t('regionSomaBay')}</option>
                <option value="safaga">{t('regionSafaga')}</option>
                <option value="el-quseir">{t('regionElQuseir')}</option>
                <option value="marsa-alam">{t('regionMarsaAlam')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {extras.length > 0 && (
        <div className={styles.field}>
          <label className={styles.label}>{t('extrasLabel')}</label>
          {extras.map((extra) => (
            <label key={extra.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={selectedExtraIds.includes(extra.id)}
                onChange={() => toggleExtra(extra.id)}
              />
              <span>{extra.name} (+{extra.price.toFixed(2)} EUR / {t('perPerson')})</span>
            </label>
          ))}
        </div>
      )}

      {serverError && <span className={styles.errorText}>{serverError}</span>}

      {/* Payment Option */}
      {totalPrice != null && totalPrice > 0 && (
        <div className={styles.paymentOption}>
          <label className={styles.label}>{t('paymentMethod')}</label>
          <div className={styles.paymentOptions}>
            <label
              className={`${styles.paymentCard} ${paymentOption === 'full' ? styles.paymentCardActive : ''}`}
              onClick={() => setPaymentOption('full')}
            >
              <div className={styles.paymentCardHeader}>
                <div className={`${styles.paymentRadio} ${paymentOption === 'full' ? styles.paymentRadioActive : ''}`} />
                <div className={styles.paymentCardTitleGroup}>
                  <span className={styles.paymentCardTitle}>{t('payFull')}</span>
                  <span className={styles.paymentCardDesc}>{t('payFullDesc')}</span>
                </div>
                <div className={styles.paymentCardAmount}>
                  {totalPrice.toFixed(2)} €
                </div>
              </div>
            </label>
            <label
              className={`${styles.paymentCard} ${paymentOption === 'deposit' ? styles.paymentCardActive : ''}`}
              onClick={() => setPaymentOption('deposit')}
            >
              <div className={styles.paymentCardHeader}>
                <div className={`${styles.paymentRadio} ${paymentOption === 'deposit' ? styles.paymentRadioActive : ''}`} />
                <div className={styles.paymentCardTitleGroup}>
                  <span className={styles.paymentCardTitle}>{t('payDeposit')}</span>
                  <span className={styles.paymentCardDesc}>{t('payDepositDesc')}</span>
                </div>
                <div className={styles.paymentCardAmount}>
                  {depositAmount != null ? depositAmount.toFixed(2) : '0.00'} €
                </div>
              </div>
              <div className={styles.paymentBreakdown}>
                <div className={styles.paymentBreakdownRow}>
                  <span>{t('subtotalLabel')}</span>
                  <span className={styles.paymentBreakdownValue}>{depositAmount != null ? depositAmount.toFixed(2) : '0.00'} €</span>
                </div>
                <div className={styles.paymentBreakdownRow}>
                  <span>{t('remainingLabel')}</span>
                  <span className={styles.paymentBreakdownValue}>{remainingAmount != null ? remainingAmount.toFixed(2) : '0.00'} €</span>
                </div>
                <div className={styles.paymentBreakdownTotal}>
                  <span>{t('totalLabel')}</span>
                  <span className={styles.paymentBreakdownTotalValue}>{totalPrice.toFixed(2)} €</span>
                </div>
              </div>
            </label>
          </div>
        </div>
      )}

      {serverError && <span className={styles.errorText}>{serverError}</span>}

      {/* Price Breakdown */}
      {dynamicPricePerPerson != null && (
        <div className={styles.priceDisplay}>
          <div style={{ marginBottom: 4 }}>
            {dynamicPricePerPerson !== pricePerPerson && pricePerPerson != null && (
              <span style={{ textDecoration: 'line-through', color: 'var(--color-text-5)', marginInlineEnd: 8 }}>
                {t('pricePerPerson', { price: pricePerPerson })}
              </span>
            )}
            {t('pricePerPerson', { price: dynamicPricePerPerson })}
          </div>
          {adults > 0 && (
            <div style={{ fontSize: 13, color: 'var(--color-text-2)' }}>
              {adults} × {dynamicPricePerPerson} € {t('priceBreakdownAdults')}
              {childrenCount > 0 && (
                <span> + {childrenCount} × {hasChildTiers ? parsePrice(childTiers[1].price)?.toFixed(0) ?? (dynamicPricePerPerson / 2).toFixed(0) : (dynamicPricePerPerson / 2).toFixed(0)} € {t('priceBreakdownChildren')}</span>
              )}
              {infants > 0 && (
                <span> + {infants} × {(participantPrices.infant?.price ?? (hasChildTiers ? parsePrice(childTiers[0].price) : 0)) === 0 ? t('free') : `${(participantPrices.infant?.price ?? (hasChildTiers ? parsePrice(childTiers[0].price) : 0))?.toFixed(2)} €`} {t('priceBreakdownInfant')}</span>
              )}
            </div>
          )}
          {adults === 0 && childrenCount > 0 && (
            <div style={{ fontSize: 13, color: 'var(--color-text-2)' }}>
              {childrenCount} × {hasChildTiers ? parsePrice(childTiers[1].price)?.toFixed(0) ?? (dynamicPricePerPerson / 2).toFixed(0) : (dynamicPricePerPerson / 2).toFixed(0)} € {t('priceBreakdownChildren')}
              {infants > 0 && (
                <span> + {infants} × {hasChildTiers ? parsePrice(childTiers[0].price)?.toFixed(0) ?? '0' : '0'} € {t('priceBreakdownInfant')}</span>
              )}
            </div>
          )}
          {extrasTotal > 0 && (
            <div style={{ fontSize: 13, color: 'var(--color-text-2)' }}>
              + {extrasTotal.toFixed(2)} € Extras
            </div>
          )}
          {transferSurcharge > 0 && (
            <div style={{ fontSize: 13, color: 'var(--color-text-2)' }}>
              + {transferSurcharge.toFixed(2)} € {t('transferSurcharge')}
            </div>
          )}
          {totalPrice != null && (
            <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>
              {t('totalLabel')}{totalPrice.toFixed(2)} EUR
            </div>
          )}
        </div>
      )}

      {totalPrice != null && totalPrice > 0 ? (
        <CheckoutButton
          tourSlug={tourSlug}
          firstName={watch('firstName') || ''}
          lastName={watch('lastName') || ''}
          email={watch('email') || ''}
          phone={watch('phone') || ''}
          date={watch('date') || ''}
          adults={adults}
          childrenCount={childrenCount}
          infants={infants}
          totalPrice={paymentOption === 'deposit' && depositAmount != null ? depositAmount : totalPrice}
          paymentOption={paymentOption}
          hotelRegion={hotelRegion}
          hotelName={hotelName}
          extraIds={selectedExtras.map((extra) => extra.id)}
          locale={typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : undefined}
          disabled={isPending || guestsTotal < 1}
        />
      ) : (
        <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%' }} disabled={isPending || guestsTotal < 1}>
          {isPending ? t('sending') : t('submitRequest')}
        </button>
      )}
      <p className={styles.disclaimer}>
        {totalPrice != null && totalPrice > 0
          ? t('stripeDisclaimer')
          : t('noDeposit')}
      </p>
    </form>
  );
}
