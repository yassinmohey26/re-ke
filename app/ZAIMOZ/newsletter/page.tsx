'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAdminLocale } from '../AdminLanguageContext';
import styles from './page.module.css';

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  source: string;
  confirmed_at: string | null;
  created_at: string;
}

export default function AdminNewsletterPage() {
  const { t, locale } = useAdminLocale();
  const dateLocale = locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar-EG' : locale === 'fr' ? 'fr-FR' : locale === 'hu' ? 'hu-HU' : locale === 'ru' ? 'ru-RU' : 'de-AT';
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then(r => r.json())
      .then(data => { setSubscribers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return subscribers;
    const q = search.toLowerCase();
    return subscribers.filter(s =>
      s.email.toLowerCase().includes(q) ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      s.source.toLowerCase().includes(q)
    );
  }, [subscribers, search]);

  const stats = useMemo(() => ({
    total: subscribers.length,
    confirmed: subscribers.filter(s => s.confirmed_at).length,
    pending: subscribers.filter(s => !s.confirmed_at).length,
    thisMonth: subscribers.filter(s => {
      const d = new Date(s.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  }), [subscribers]);

  async function handleDelete(id: number) {
    if (!confirm(t('confirmDelete'))) return;
    setDeleting(id);
    await fetch('/api/admin/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    setSubscribers(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  }

  function handleExport() {
    const header = 'Email,Name,Source,Confirmed,Created';
    const rows = filtered.map(s =>
      [s.email, s.name || '', s.source, s.confirmed_at ? 'Yes' : 'No', new Date(s.created_at).toISOString()].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('newsletterTitle')}</h1>
          <p className={styles.subtitle}>{t('newsletterSubtitle')}</p>
        </div>
        <button className={styles.exportBtn} onClick={handleExport} disabled={filtered.length === 0}>
          CSV Export ({filtered.length})
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>{t('newsletterSubscribers')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.confirmed}</span>
          <span className={styles.statLabel}>{t('newsletterConfirmed')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.pending}</span>
          <span className={styles.statLabel}>{t('newsletterPending')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.thisMonth}</span>
          <span className={styles.statLabel}>{locale === 'en' ? 'This Month' : locale === 'ru' ? 'В этом месяце' : locale === 'fr' ? 'Ce mois-ci' : locale === 'hu' ? 'Ebben a hónapban' : 'Diesen Monat'}</span>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder={locale === 'en' ? 'Search by email, name...' : locale === 'ru' ? 'Поиск по email, имени...' : locale === 'fr' ? 'Rechercher par email, nom...' : locale === 'hu' ? 'Keresés email, név szerint...' : 'Suche nach E-Mail, Name...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('newsletterColEmail')}</th>
              <th>{t('newsletterColName')}</th>
              <th>{t('newsletterColSource')}</th>
              <th>{t('newsletterColConfirmed')}</th>
              <th>{t('newsletterColCreated')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className={styles.loading}>{t('loading')}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className={styles.empty}>{search ? t('noResults') : 'No subscribers yet.'}</td></tr>
            ) : (
              filtered.map(sub => (
                <tr key={sub.id}>
                  <td className={styles.mono}>{sub.email}</td>
                  <td>{sub.name || '—'}</td>
                  <td><span className={styles.sourceBadge}>{sub.source}</span></td>
                  <td>
                    {sub.confirmed_at ? (
                      <span className={styles.confirmed}>{t('newsletterConfirmed')}</span>
                    ) : (
                      <span className={styles.pending}>{t('newsletterPending')}</span>
                    )}
                  </td>
                  <td>{new Date(sub.created_at).toLocaleDateString(dateLocale)}</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(sub.id)}
                      disabled={deleting === sub.id}
                    >
                      {deleting === sub.id ? '...' : t('delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
