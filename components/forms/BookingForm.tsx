'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { bookingSchema, type BookingFormData } from '@/lib/validations';
import { submitBooking } from '@/lib/actions';
import styles from './BookingForm.module.css';

interface BookingFormProps {
  tourSlug: string;
  tourName: string;
  pricePerPerson?: number | null;
}

export default function BookingForm({ tourSlug, tourName, pricePerPerson }: BookingFormProps) {
  const t = useTranslations('booking');
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tourSlug,
      tourName,
      guests: 1,
    },
  });

  const onSubmit = (data: BookingFormData) => {
    setServerError('');
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });
      fd.append('tourSlug', tourSlug);
      fd.append('tourName', tourName);
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

      {serverError && <span className={styles.errorText}>{serverError}</span>}

      {pricePerPerson && (
        <div className={styles.priceDisplay}>
          {t('pricePerPerson', { price: pricePerPerson })}
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
