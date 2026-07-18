'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ungültige Anmeldedaten');
        setLoading(false);
        return;
      }

      router.push('/ZAIMOZ');
      router.refresh();
    } catch {
      setError('Verbindungsfehler');
      setLoading(false);
    }
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <div className={styles.loginHeader}>
        <h1 className={styles.loginTitle}>Hurghada Reiseplaner</h1>
        <p className={styles.loginSubtitle}>Admin-Bereich</p>
      </div>

      {error && <div className={styles.loginError}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>E-Mail</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Passwort</label>
        <input
          id="password"
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className={styles.loginButton} disabled={loading}>
        {loading ? 'Anmelden...' : 'Anmelden'}
      </button>
    </form>
  );
}
