'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminLocale } from '../AdminLanguageContext';
import LocalePicker from '@/components/admin/LocalePicker';
import styles from './page.module.css';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
}

const EMPTY_FORM = { question: '', answer: '', sort_order: 0 };

export default function AdminFAQsPage() {
  const { t, locale } = useAdminLocale();
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [duplicateId, setDuplicateId] = useState<number | null>(null);

  useEffect(() => { fetchFaqs(); }, []);

  async function fetchFaqs() {
    const res = await fetch('/api/admin/faqs');
    if (res.ok) {
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }

  function openAdd() {
    setEditingId(null);
    setForm({ question: '', answer: '', sort_order: faqs.length });
    setShowForm(true);
  }

  function openEdit(faq: FAQ) {
    setEditingId(faq.id);
    setForm({ question: faq.question, answer: faq.answer, sort_order: faq.sort_order });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);

    if (editingId !== null) {
      const res = await fetch(`/api/admin/faqs/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFaqs(faqs.map(f => f.id === editingId ? { ...f, ...form } : f));
      }
    } else {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newFaq = await res.json();
        setFaqs([...faqs, newFaq].sort((a, b) => a.sort_order - b.sort_order));
      }
    }

    setSaving(false);
    cancelForm();
  }

  async function handleDelete(id: number) {
    if (!confirm(t('confirmDeleteTour'))) return;
    const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
    if (res.ok) setFaqs(faqs.filter(f => f.id !== id));
  }

  async function handleDuplicate(dupLocale: string) {
    if (!duplicateId) return;
    const res = await fetch('/api/admin/duplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'faqs', id: duplicateId, locale: dupLocale }),
    });
    setDuplicateId(null);
    if (res.ok) {
      router.refresh();
    } else {
      const err = await res.json();
      alert(err.error || 'Duplicate failed');
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('blogTitle')}</h1>
          <p className={styles.subtitle}>{faqs.length} {locale === 'de' ? 'Einträge' : 'entries'}</p>
        </div>
        {!showForm && (
          <button className={styles.addBtn} onClick={openAdd}>
            {locale === 'de' ? '+ Neue FAQ' : '+ New FAQ'}
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>
            {editingId !== null
              ? (locale === 'de' ? 'FAQ bearbeiten' : 'Edit FAQ')
              : (locale === 'de' ? 'Neue FAQ erstellen' : 'Create New FAQ')}
          </h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{locale === 'de' ? 'Frage' : 'Question'}</label>
              <input
                className={styles.formInput}
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
                placeholder={locale === 'de' ? 'Frage eingeben...' : 'Enter question...'}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{locale === 'de' ? 'Antwort' : 'Answer'}</label>
              <textarea
                className={styles.formTextarea}
                value={form.answer}
                onChange={e => setForm({ ...form, answer: e.target.value })}
                placeholder={locale === 'de' ? 'Antwort eingeben...' : 'Enter answer...'}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{locale === 'de' ? 'Reihenfolge' : 'Sort Order'}</label>
              <input
                className={styles.formInput}
                type="number"
                value={form.sort_order}
                onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                style={{ maxWidth: 120 }}
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving
                ? (locale === 'de' ? 'Speichern...' : 'Saving...')
                : (locale === 'de' ? 'Speichern' : 'Save')}
            </button>
            <button className={styles.cancelBtn} onClick={cancelForm}>
              {locale === 'de' ? 'Abbrechen' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{locale === 'de' ? 'Frage' : 'Question'}</th>
              <th>{locale === 'de' ? 'Antwort' : 'Answer'}</th>
              <th>{locale === 'de' ? 'Reihenfolge' : 'Sort'}</th>
              <th>{locale === 'de' ? 'Aktionen' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4}>{locale === 'de' ? 'Laden...' : 'Loading...'}</td></tr>
            ) : faqs.length === 0 ? (
              <tr><td colSpan={4} className={styles.empty}>
                {locale === 'de' ? 'Noch keine FAQs vorhanden.' : 'No FAQs yet.'}
              </td></tr>
            ) : (
              faqs.map(faq => (
                <tr key={faq.id}>
                  <td className={styles.questionCell}>{faq.question}</td>
                  <td className={styles.answerCell}>{faq.answer}</td>
                  <td className={styles.sortOrder}>{faq.sort_order}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(faq)}>
                        {locale === 'de' ? 'Bearbeiten' : 'Edit'}
                      </button>
                      <button className={styles.editBtn} onClick={() => setDuplicateId(faq.id)}>
                        {locale === 'de' ? 'Duplizieren' : 'Duplicate'}
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(faq.id)}>
                        {locale === 'de' ? 'Löschen' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {duplicateId && (
        <LocalePicker
          onSelect={handleDuplicate}
          onCancel={() => setDuplicateId(null)}
        />
      )}
    </div>
  );
}
