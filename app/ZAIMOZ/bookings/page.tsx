'use client';

import { useEffect, useState } from 'react';
import { useAdminLocale } from '../AdminLanguageContext';
import styles from './page.module.css';

interface Booking {
  id: number;
  tour_name: string;
  tour_slug: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED' | 'PAYMENT_FAILED';
  created_at: string;
}

export default function AdminBookingsPage() {
  const { t, locale } = useAdminLocale();
  const dateLocale = locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar-EG' : locale === 'fr' ? 'fr-FR' : locale === 'hu' ? 'hu-HU' : locale === 'ru' ? 'ru-RU' : 'de-AT';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: t('statusPending'), color: '#f59e0b' },
    CONFIRMED: { label: t('statusConfirmed'), color: '#10b981' },
    CANCELLED: { label: t('statusCancelled'), color: '#ef4444' },
    COMPLETED: { label: t('statusCompleted'), color: '#6b7280' },
    PAYMENT_FAILED: { label: t('statusPaymentFailed'), color: '#ef4444' },
    REFUNDED: { label: t('statusRefunded'), color: '#8b5cf6' },
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateStatus', id, status: newStatus }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as Booking['status'] } : b));
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;
    await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('bookingsTitle')}</h1>
          <p className={styles.subtitle}>{t('bookingsSubtitle')}</p>
        </div>
      </div>

      {loading ? (
        <p className={styles.loading}>{t('loading')}</p>
      ) : bookings.length === 0 ? (
        <p className={styles.empty}>No bookings yet.</p>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('bookingsId')}</th>
                  <th>{t('bookingsTour')}</th>
                  <th>{t('bookingsName')}</th>
                  <th>{t('bookingsEmail')}</th>
                  <th>{t('bookingsDate')}</th>
                  <th>{t('bookingsGuests')}</th>
                  <th>{t('bookingsStatus')}</th>
                  <th>{t('bookingsCreated')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => {
                  const status = STATUS_LABELS[booking.status];
                  return (
                    <tr key={booking.id}>
                      <td className={styles.mono}>#{booking.id}</td>
                      <td className={styles.tourName}>{booking.tour_name}</td>
                      <td>{booking.first_name} {booking.last_name}</td>
                      <td className={styles.mono}>{booking.email}</td>
                      <td>{booking.date ? new Date(booking.date).toLocaleDateString(dateLocale) : '—'}</td>
                      <td className={styles.center}>{booking.guests}</td>
                      <td>
                        <span className={styles.statusBadge} style={{ background: status.color + '15', color: status.color }}>
                          {status.label}
                        </span>
                      </td>
                      <td>{new Date(booking.created_at).toLocaleDateString(dateLocale)}</td>
                      <td>
                        <div className={styles.actions}>
                          <select
                            className={styles.statusSelect}
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          >
                            <option value="PENDING">{t('statusPending')}</option>
                            <option value="CONFIRMED">{t('statusConfirmed')}</option>
                            <option value="CANCELLED">{t('statusCancelled')}</option>
                            <option value="COMPLETED">{t('statusCompleted')}</option>
                            <option value="PAYMENT_FAILED">{t('statusPaymentFailed')}</option>
                            <option value="REFUNDED">{t('statusRefunded')}</option>
                          </select>
                          <button className={styles.deleteBtn} onClick={() => handleDelete(booking.id)}>
                            {t('delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card list ── */}
          <div className={styles.mobileCardList}>
            {bookings.map(booking => {
              const status = STATUS_LABELS[booking.status];
              return (
                <div key={booking.id} className={styles.mobileCard}>
                  <p className={styles.mobileCardName}>
                    #{booking.id} · {booking.tour_name}
                  </p>

                  <div className={styles.mobileCardMeta}>
                    <div className={styles.mobileCardMetaItem}>
                      <span className={styles.mobileCardMetaLabel}>{t('bookingsName')}</span>
                      <span className={styles.mobileCardMetaValue}>{booking.first_name} {booking.last_name}</span>
                    </div>
                    <div className={styles.mobileCardMetaItem}>
                      <span className={styles.mobileCardMetaLabel}>{t('bookingsStatus')}</span>
                      <span className={styles.mobileCardMetaValue}>
                        <span className={styles.statusBadge} style={{ background: status.color + '15', color: status.color }}>
                          {status.label}
                        </span>
                      </span>
                    </div>
                    <div className={styles.mobileCardMetaItem}>
                      <span className={styles.mobileCardMetaLabel}>{t('bookingsDate')}</span>
                      <span className={styles.mobileCardMetaValue}>{booking.date ? new Date(booking.date).toLocaleDateString(dateLocale) : '—'}</span>
                    </div>
                    <div className={styles.mobileCardMetaItem}>
                      <span className={styles.mobileCardMetaLabel}>{t('bookingsGuests')}</span>
                      <span className={styles.mobileCardMetaValue}>{booking.guests}</span>
                    </div>
                    <div className={styles.mobileCardMetaItem}>
                      <span className={styles.mobileCardMetaLabel}>{t('bookingsEmail')}</span>
                      <span className={styles.mobileCardMetaValue + ' ' + styles.mono}>{booking.email}</span>
                    </div>
                    <div className={styles.mobileCardMetaItem}>
                      <span className={styles.mobileCardMetaLabel}>{t('bookingsCreated')}</span>
                      <span className={styles.mobileCardMetaValue}>{new Date(booking.created_at).toLocaleDateString(dateLocale)}</span>
                    </div>
                  </div>

                  <div className={styles.mobileCardStatusRow}>
                    <select
                      className={styles.statusSelect}
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    >
                      <option value="PENDING">{t('statusPending')}</option>
                      <option value="CONFIRMED">{t('statusConfirmed')}</option>
                      <option value="CANCELLED">{t('statusCancelled')}</option>
                      <option value="COMPLETED">{t('statusCompleted')}</option>
                      <option value="PAYMENT_FAILED">{t('statusPaymentFailed')}</option>
                      <option value="REFUNDED">{t('statusRefunded')}</option>
                    </select>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(booking.id)}>
                      {t('delete')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
