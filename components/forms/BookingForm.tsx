'use client';

import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createBookingSchema, type BookingFormData } from '@/lib/validations';
import { submitBooking } from '@/lib/actions';
import { type PricingTier, getPriceForGuests } from '@/lib/pricing-table';
import styles from './BookingForm.module.css';

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

interface BookingFormProps {
  tourSlug: string;
  tourName: string;
  pricePerPerson?: number | null;
  pricingTiers?: PricingTier[];
  extras?: Extra[];
  initialSelectedExtraIds?: string[];
  initialDate?: string;
  initialGuests?: number;
}

export default function BookingForm({
  tourSlug,
  tourName,
  pricePerPerson,
  pricingTiers = [],
  extras = [],
  initialSelectedExtraIds = [],
  initialDate = '',
  initialGuests = 1,
}: BookingFormProps) {
  const t = useTranslations('booking');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>(initialSelectedExtraIds);
  const minimumDate = getTodayLocalDate();
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
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tourSlug,
      tourName,
      date: initialDate,
      guests: initialGuests,
    },
  });

  const guests = watch('guests') || 1;
  const dynamicPricePerPerson = getPriceForGuests(pricingTiers, pricePerPerson ?? null, guests);

  function toggleExtra(id: string) {
    setSelectedExtraIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const selectedExtras = extras.filter((e) => selectedExtraIds.includes(e.id));
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const totalPrice = dynamicPricePerPerson != null ? dynamicPricePerPerson * guests + extrasTotal : null;

  const onSubmit = (data: BookingFormData) => {
    setServerError('');
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });
      fd.append('tourSlug', tourSlug);
      fd.append('tourName', tourName);
      fd.append('extrasJson', JSON.stringify(selectedExtras));
      if (totalPrice != null) fd.append('totalPrice', String(totalPrice));
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
          placeholder="Max"
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
          placeholder="Mustermann"
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
          placeholder="max@beispiel.at"
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
          placeholder="+43 664 1234567"
          className={`${styles.input} ${errors.phone ? styles.error : ''}`}
          {...register('phone')}
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone.message}</span>}
      </div>

      <div className={styles.row}>
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

        <div className={styles.field}>
          <label htmlFor="booking-guests" className={styles.label}>
            {t('guests')} <span aria-hidden>*</span>
          </label>
          <input
            id="booking-guests"
            type="number"
            min={1}
            max={20}
            className={`${styles.input} ${errors.guests ? styles.error : ''}`}
            {...register('guests', { valueAsNumber: true })}
          />
          {errors.guests && <span className={styles.errorText}>{errors.guests.message}</span>}
        </div>
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

      {extras.length > 0 && (
        <div className={styles.field}>
          <label className={styles.label}>Extras</label>
          {extras.map((extra) => (
            <label key={extra.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={selectedExtraIds.includes(extra.id)}
                onChange={() => toggleExtra(extra.id)}
              />
              <span>{extra.name} (+{extra.price.toFixed(2)} EUR)</span>
            </label>
          ))}
        </div>
      )}

      {serverError && <span className={styles.errorText}>{serverError}</span>}

      {dynamicPricePerPerson != null && (
        <div className={styles.priceDisplay}>
          {dynamicPricePerPerson !== pricePerPerson && pricePerPerson != null && (
            <span style={{ textDecoration: 'line-through', color: 'var(--color-text-5)', marginRight: 8 }}>
              {t('pricePerPerson', { price: pricePerPerson })}
            </span>
          )}
          {t('pricePerPerson', { price: dynamicPricePerPerson })}
        </div>
      )}

      {totalPrice != null && guests > 1 && (
        <div className={styles.priceDisplay}>
          {guests} × {dynamicPricePerPerson} EUR + {extrasTotal.toFixed(2)} EUR extras = <strong>{totalPrice.toFixed(2)} EUR</strong>
        </div>
      )}

      <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%' }} disabled={isPending}>
        {isPending ? t('sending') : t('submitRequest')}
      </button>
      <p className={styles.disclaimer}>
        {t('noDeposit')}
      </p>
    </form>
  );
}
