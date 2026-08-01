'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminLocale } from '../AdminLanguageContext';
import LocalePicker from '@/components/admin/LocalePicker';
import styles from './page.module.css';

interface Tour {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | null;
  destination: string;
  featured: boolean;
  active: boolean;
}

export default function AdminToursPage() {
  const { t } = useAdminLocale();
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [duplicateId, setDuplicateId] = useState<string | null>(null);

  useEffect(() => { fetchTours(); }, []);

  async function fetchTours() {
    const res = await fetch('/api/admin/tours');
    const data = await res.json();
    setTours(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(t('confirmDeleteTour'))) return;
    const res = await fetch(`/api/admin/tours/${id}`, { method: 'DELETE' });
    if (res.ok) setTours(tours.filter(tour => tour.id !== id));
  }

  async function toggleFeatured(id: string, current: boolean) {
    const res = await fetch(`/api/admin/tours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !current }),
    });
    if (res.ok) setTours(tours.map(tour => tour.id === id ? { ...tour, featured: !current } : tour));
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/tours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !current }),
    });
    if (res.ok) setTours(tours.map(tour => tour.id === id ? { ...tour, active: !current } : tour));
  }

  async function handleDuplicate(locale: string) {
    if (!duplicateId) return;
    const res = await fetch('/api/admin/duplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'tours', id: duplicateId, locale }),
    });
    setDuplicateId(null);
    if (res.ok) {
      router.push(`/ZAIMOZ/tours/edit/${duplicateId}`);
    } else {
      const err = await res.json();
      alert(err.error || 'Duplicate failed');
    }
  }

  const categoryMap: Record<string, string> = {
    kultur: t('catKultur'),
    cultural: t('catKultur'),
    ganztag: t('catKultur'),
    halbtag: t('catKultur'),
    schnorchel: t('catSchnorchel'),
    snorkel: t('catSchnorchel'),
    wassersport: t('catSchnorchel'),
    safari: t('catSafari'),
    'wuesten-safari': t('catSafari'),
  };

  const filtered = tours.filter(tour => {
    const matchSearch = tour.name.toLowerCase().includes(search.toLowerCase()) || tour.destination.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || tour.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('toursTitle')}</h1>
          <p className={styles.subtitle}>{tours.length} {t('toursTotal')}</p>
        </div>
        <Link href="/ZAIMOZ/tours/new" className={styles.addBtn}>{t('newTourBtn')}</Link>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">{t('allCategories')}</option>
          <option value="kultur">{t('catKultur')}</option>
          <option value="schnorchel">{t('catSchnorchel')}</option>
          <option value="safari">{t('catSafari')}</option>
        </select>
      </div>

      {loading ? (
        <p className={styles.loading}>{t('loading')}</p>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('colName')}</th>
                  <th>{t('colCategory')}</th>
                  <th>{t('colDestination')}</th>
                  <th>{t('colPrice')}</th>
                  <th>{t('colFeatured')}</th>
                  <th>{t('colActive')}</th>
                  <th>{t('colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tour) => (
                  <tr key={tour.id}>
                    <td className={styles.tourName}>{tour.name}</td>
                    <td>
                      <span className={styles.badge}>{categoryMap[tour.category] || tour.category}</span>
                    </td>
                    <td>{tour.destination}</td>
                    <td>{tour.price ? `€${tour.price}` : t('onRequest')}</td>
                    <td>
                      <button
                        className={`${styles.toggleBtn} ${tour.featured ? styles.activeToggle : ''}`}
                        onClick={() => toggleFeatured(tour.id, tour.featured)}
                      >
                        {tour.featured ? '★' : '☆'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`${styles.toggleBtn} ${tour.active ? styles.activeToggle : ''}`}
                        onClick={() => toggleActive(tour.id, tour.active)}
                      >
                        {tour.active ? '✓' : '✕'}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/ZAIMOZ/tours/edit/${tour.id}`} className={styles.editBtn}>{t('edit')}</Link>
                        <button className={styles.editBtn} onClick={() => setDuplicateId(tour.id)}>
                          {t('duplicateBtn')}
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(tour.id)}
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.empty}>{t('noResults')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card list ── */}
          <div className={styles.mobileCardList}>
            {filtered.length === 0 && (
              <p className={styles.empty}>{t('noResults')}</p>
            )}
            {filtered.map((tour) => (
              <div key={tour.id} className={styles.mobileCard}>
                <p className={styles.mobileCardName}>{tour.name}</p>

                <div className={styles.mobileCardMeta}>
                  <div className={styles.mobileCardMetaItem}>
                    <span className={styles.mobileCardMetaLabel}>{t('colCategory')}</span>
                    <span className={styles.mobileCardMetaValue}>
                      <span className={styles.badge}>{categoryMap[tour.category] || tour.category}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCardMetaItem}>
                    <span className={styles.mobileCardMetaLabel}>{t('colDestination')}</span>
                    <span className={styles.mobileCardMetaValue}>{tour.destination}</span>
                  </div>
                  <div className={styles.mobileCardMetaItem}>
                    <span className={styles.mobileCardMetaLabel}>{t('colPrice')}</span>
                    <span className={styles.mobileCardMetaValue}>{tour.price ? `€${tour.price}` : t('onRequest')}</span>
                  </div>
                </div>

                <div className={styles.mobileCardToggles}>
                  <span className={styles.mobileCardToggleLabel}>
                    {t('colFeatured')}
                    <button
                      className={`${styles.toggleBtn} ${tour.featured ? styles.activeToggle : ''}`}
                      onClick={() => toggleFeatured(tour.id, tour.featured)}
                    >
                      {tour.featured ? '★' : '☆'}
                    </button>
                  </span>
                  <span className={styles.mobileCardToggleLabel}>
                    {t('colActive')}
                    <button
                      className={`${styles.toggleBtn} ${tour.active ? styles.activeToggle : ''}`}
                      onClick={() => toggleActive(tour.id, tour.active)}
                    >
                      {tour.active ? '✓' : '✕'}
                    </button>
                  </span>
                </div>

                <div className={styles.mobileCardActions}>
                  <Link href={`/ZAIMOZ/tours/edit/${tour.id}`} className={styles.editBtn}>{t('edit')}</Link>
                  <button className={styles.editBtn} onClick={() => setDuplicateId(tour.id)}>
                    {t('duplicateBtn')}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(tour.id)}
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {duplicateId && (
        <LocalePicker
          onSelect={handleDuplicate}
          onCancel={() => setDuplicateId(null)}
        />
      )}
    </div>
  );
}
