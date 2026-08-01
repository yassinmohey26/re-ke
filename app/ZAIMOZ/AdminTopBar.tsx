'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAdminLocale } from './AdminLanguageContext';
import { useAdminTheme } from './AdminThemeContext';
import styles from './AdminTopBar.module.css';

interface Booking {
  id: number;
  tour_name: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  subject: string | null;
  read: boolean;
  created_at: string;
}

const UNREAD_STATUSES = new Set(['PENDING', 'PAYMENT_FAILED']);

export default function AdminTopBar() {
  const { t, locale } = useAdminLocale();
  const { theme, toggleTheme } = useAdminTheme();
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);

  const dateLocale = locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar-EG' : locale === 'fr' ? 'fr-FR' : locale === 'hu' ? 'hu-HU' : locale === 'ru' ? 'ru-RU' : 'de-AT';

  const refresh = useCallback(async () => {
    try {
      const [b, c] = await Promise.all([
        fetch('/api/admin/bookings').then(r => r.json()),
        fetch('/api/admin/contacts').then(r => r.json()),
      ]);
      setBookings(Array.isArray(b) ? b : []);
      setContacts(Array.isArray(c) ? c : []);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 60000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const unreadBookings = bookings.filter(b => UNREAD_STATUSES.has(b.status));
  const unreadContacts = contacts.filter(c => !c.read);
  const unreadTotal = unreadBookings.length + unreadContacts.length;

  const latestBookings = unreadBookings.slice(0, 4);
  const latestContacts = unreadContacts.slice(0, 4);

  return (
    <div className={styles.topBar}>
      <button
        className={styles.themeBtn}
        onClick={toggleTheme}
        title={theme === 'dark' ? t('lightMode') : t('darkMode')}
        aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className={styles.bellWrap} ref={popupRef}>
        <button
          className={`${styles.bellBtn} ${open ? styles.bellOpen : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={t('notifications')}
        >
          🔔
          {unreadTotal > 0 && (
            <span className={styles.badge}>{unreadTotal > 99 ? '99+' : unreadTotal}</span>
          )}
        </button>

        {open && (
          <div className={styles.popup}>
            <div className={styles.popupHeader}>
              <span>{t('notifications')}</span>
              {unreadTotal > 0 && <span className={styles.popupCount}>{unreadTotal}</span>}
            </div>

            <div className={styles.popupBody}>
              {latestBookings.length === 0 && latestContacts.length === 0 && (
                <div className={styles.empty}>{t('notificationsEmpty')}</div>
              )}

              {latestBookings.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupTitle}>📋 {t('navBookings')}</div>
                  {latestBookings.map(b => (
                    <Link key={`b${b.id}`} href="/ZAIMOZ/bookings" className={styles.item} onClick={() => setOpen(false)}>
                      <span className={styles.itemDot} />
                      <span className={styles.itemText}>
                        <span className={styles.itemTitle}>{b.tour_name}</span>
                        <span className={styles.itemMeta}>
                          {b.first_name} {b.last_name} · {new Date(b.created_at).toLocaleDateString(dateLocale)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {latestContacts.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupTitle}>📬 {t('navContacts')}</div>
                  {latestContacts.map(c => (
                    <Link key={`c${c.id}`} href="/ZAIMOZ/contacts" className={styles.item} onClick={() => setOpen(false)}>
                      <span className={styles.itemDot} />
                      <span className={styles.itemText}>
                        <span className={styles.itemTitle}>{c.subject || c.name}</span>
                        <span className={styles.itemMeta}>
                          {c.name} · {new Date(c.created_at).toLocaleDateString(dateLocale)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.popupFooter}>
              <Link href="/ZAIMOZ/bookings" onClick={() => setOpen(false)}>{t('viewBookings')}</Link>
              <Link href="/ZAIMOZ/contacts" onClick={() => setOpen(false)}>{t('viewContacts')}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
