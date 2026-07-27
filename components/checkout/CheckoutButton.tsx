'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './checkout-button.module.css';

interface CheckoutButtonProps {
  tourSlug: string;
  tourName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  totalPrice: number;
  paymentOption?: 'full' | 'deposit';
  extrasJson?: string;
  locale?: string;
  disabled?: boolean;
}

export default function CheckoutButton({
  tourSlug,
  tourName,
  firstName,
  lastName,
  email,
  phone,
  date,
  guests,
  totalPrice,
  paymentOption = 'full',
  extrasJson,
  locale,
  disabled = false,
}: CheckoutButtonProps) {
  const t = useTranslations('checkout');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    if (totalPrice <= 0) {
      setError(t('errorInvalidPrice'));
      return;
    }

    setLoading(true);
    setError('');

    try {
const res = await fetch('/api/checkout/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tourSlug,
        tourName,
        firstName,
        lastName,
        email,
        phone,
        date,
        guests,
        totalPrice,
        paymentOption,
        extrasJson,
        locale,
      }),
    });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('errorFailed'));
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.button} btn btn--primary btn--lg`}
        onClick={handleClick}
        disabled={disabled || loading}
        style={{ width: '100%' }}
      >
        {loading ? (
          <span className={styles.spinnerWrapper}>
            <span className={styles.spinner} />
            {t('redirecting')}
          </span>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, flexShrink: 0 }}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            {paymentOption === 'deposit'
              ? t('payDeposit') + ' ' + totalPrice.toFixed(2) + ' €'
              : t('payWithCard') + ' ' + totalPrice.toFixed(2) + ' €'}
          </>
        )}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
