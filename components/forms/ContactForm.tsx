'use client';

import { useRef, useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations';
import { submitContact } from '@/lib/actions';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    setServerError('');
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, String(v));
      });
      const result = await submitContact(fd);
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
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="#3ab446" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3>{t('successTitle')}</h3>
        <p>{t('successDesc')}</p>
        <button className="btn btn--outline" onClick={() => setSuccess(false)}>
          {t('newMessage')}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
      noValidate
    >
      {/* Honeypot field — hidden from humans */}
      <input
        type="text"
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
      />

      <div className={styles.row}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            {t('name')} <span aria-hidden>*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Max Mustermann"
            className={`form-input ${errors.name ? 'error' : ''}`}
            {...register('name')}
          />
          {errors.name && (
            <span className="form-error" role="alert">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            {t('email')} <span aria-hidden>*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="max@beispiel.at"
            className={`form-input ${errors.email ? 'error' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <span className="form-error" role="alert">{errors.email.message}</span>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">{t('phoneOptional')}</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+43 664 1234567"
            className="form-input"
            {...register('phone')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="form-label">{t('subject')}</label>
          <select id="subject" className="form-select" {...register('subject')}>
            <option value="">{t('subjectPlaceholder')}</option>
            <option value="Tourenbuchung">{t('subjectTour')}</option>
            <option value="Preisanfrage">{t('subjectPrice')}</option>
            <option value="Gruppenreise">{t('subjectGroup')}</option>
            <option value="Privattour">{t('subjectPrivate')}</option>
            <option value="Sonstiges">{t('subjectOther')}</option>
          </select>
        </div>
      </div>

      <div className="form-group">
          <label htmlFor="message" className="form-label">
            {t('message')} <span aria-hidden>*</span>
          </label>
          <textarea
            id="message"
            placeholder={t('messagePlaceholder')}
          className={`form-textarea ${errors.message ? 'error' : ''}`}
          rows={5}
          {...register('message')}
        />
        {errors.message && (
          <span className="form-error" role="alert">{errors.message.message}</span>
        )}
      </div>

      {serverError && (
        <div className={styles.serverError} role="alert">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        className="btn btn--primary btn--lg"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <span className={styles.spinner} aria-hidden />
            {t('sending')}
          </>
        ) : (
          t('send')
        )}
      </button>

      <p className={styles.privacy}>
        {t('privacyText')}{' '}
        <a href={`/${locale}/datenschutz`}>{t('privacyLink')}</a>.
      </p>
    </form>
  );
}
