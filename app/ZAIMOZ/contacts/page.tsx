'use client';

import { useEffect, useState } from 'react';
import { useAdminLocale } from '../AdminLanguageContext';
import styles from './page.module.css';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export default function AdminContactsPage() {
  const { t, locale } = useAdminLocale();
  const dateLocale = locale === 'en' ? 'en-GB' : 'de-AT';
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/contacts')
      .then(r => r.json())
      .then(data => { setContacts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: number) => {
    await fetch('/api/admin/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markRead', id }),
    });
    setContacts(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;
    await fetch('/api/admin/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('contactsTitle')}</h1>
          <p className={styles.subtitle}>{t('contactsSubtitle')}</p>
        </div>
      </div>

      <div className={styles.messageList}>
        {loading ? (
          <p>{t('loading')}</p>
        ) : contacts.length === 0 ? (
          <p>No contact messages yet.</p>
        ) : (
          contacts.map(msg => (
            <div key={msg.id} className={`${styles.messageCard} ${!msg.read ? styles.unread : ''}`}>
              <div className={styles.messageHeader}>
                <div className={styles.messageMeta}>
                  <span className={styles.messageName}>{msg.name}</span>
                  <span className={styles.messageEmail}>{msg.email}</span>
                  {msg.phone && <span className={styles.messagePhone}>{msg.phone}</span>}
                </div>
                <span className={styles.messageDate}>
                  {new Date(msg.created_at).toLocaleDateString(dateLocale)}
                </span>
              </div>
              {msg.subject && <h3 className={styles.messageSubject}>{msg.subject}</h3>}
              <p className={styles.messageBody}>{msg.message}</p>
              <div className={styles.messageActions}>
                {!msg.read && (
                  <button className={styles.markReadBtn} onClick={() => handleMarkRead(msg.id)}>
                    {t('markAsRead')}
                  </button>
                )}
                <button className={styles.deleteBtn} onClick={() => handleDelete(msg.id)}>
                  {t('delete')}
                </button>
              </div>
              {!msg.read && <span className={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
