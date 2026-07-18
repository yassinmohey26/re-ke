'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { subscribeNewsletter } from '@/lib/actions';
import styles from './NewsletterForm.module.css';

export default function NewsletterForm() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    const fd = new FormData();
    fd.append('email', email.trim());
    const result = await subscribeNewsletter(fd);

    if (result.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
      setErrorMsg(result.error ?? t('errorDefault'));
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <p>{t('success')}</p>
        <button onClick={() => setStatus('idle')} className={styles.resetBtn}>{t('resetBtn')}</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.row}>
        <input
          type="email"
          placeholder={t('placeholder')}
          className={`${styles.input} ${status === 'error' ? styles.error : ''}`}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
          required
        />
        <button type="submit" className={styles.btn} disabled={status === 'loading'}>
          {status === 'loading' ? '...' : t('subscribe')}
        </button>
      </div>
      {errorMsg && <span className={styles.errorText}>{errorMsg}</span>}
    </form>
  );
}
