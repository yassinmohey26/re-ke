'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import { useAdminLocale } from '../AdminLanguageContext';
import styles from './page.module.css';

interface TranslationRow {
  locale: string;
  tagline: string;
  description: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  translations: TranslationRow[];
  created_at: string;
}

const LOCALES = ['de', 'en', 'ru'] as const;

const EMPTY_FORM = { name: '', slug: '', tagline: '', description: '', image: '' };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminDestinationsPage() {
  const { t } = useAdminLocale();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [activeLocale, setActiveLocale] = useState<'de' | 'en' | 'ru'>('de');
  const [translations, setTranslations] = useState<Record<string, { tagline: string; description: string }>>({
    en: { tagline: '', description: '' },
    ru: { tagline: '', description: '' },
  });

  useEffect(() => { fetchDestinations(); }, []);

  async function fetchDestinations() {
    try {
      const res = await fetch('/api/admin/destinations');
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (e) {
      console.error('Failed to fetch destinations:', e);
    }
    setLoading(false);
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setAutoSlug(true);
    setActiveLocale('de');
    setTranslations({ en: { tagline: '', description: '' }, ru: { tagline: '', description: '' } });
    setShowForm(true);
  }

  function openEdit(dest: Destination) {
    setEditingId(dest.id);
    setForm({
      name: dest.name,
      slug: dest.slug,
      tagline: dest.tagline || '',
      description: dest.description || '',
      image: dest.image || '',
    });
    setAutoSlug(false);
    setActiveLocale('de');

    const trans: Record<string, { tagline: string; description: string }> = {
      en: { tagline: '', description: '' },
      ru: { tagline: '', description: '' },
    };
    for (const tr of dest.translations ?? []) {
      trans[tr.locale] = { tagline: tr.tagline || '', description: tr.description || '' };
    }
    setTranslations(trans);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleNameChange(name: string) {
    setForm(prev => ({
      ...prev,
      name,
      slug: autoSlug ? slugify(name) : prev.slug,
    }));
  }

  function updateTrans(locale: string, key: 'tagline' | 'description', value: string) {
    setTranslations(prev => ({
      ...prev,
      [locale]: { ...prev[locale], [key]: value },
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      tagline: form.tagline || '',
      description: form.description || '',
      image: form.image || '',
      translations,
    };

    try {
      if (editingId !== null) {
        const res = await fetch(`/api/admin/destinations/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setDestinations(destinations.map(d => d.id === editingId ? { ...d, ...updated } : d));
        }
      } else {
        const res = await fetch('/api/admin/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchDestinations();
        }
      }
    } catch (e) {
      console.error('Failed to save destination:', e);
    }

    setSaving(false);
    cancelForm();
  }

  async function handleDelete(id: string) {
    if (!confirm(t('destConfirmDelete'))) return;
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE' });
      if (res.ok) setDestinations(destinations.filter(d => d.id !== id));
    } catch (e) {
      console.error('Failed to delete destination:', e);
    }
  }

  function renderTransFields(locale: string) {
    const tr = translations[locale] || { tagline: '', description: '' };
    return (
      <>
        <p style={{ fontSize: 12, color: 'var(--color-text-4)', marginBottom: 'var(--space-3)', fontStyle: 'italic' }}>
          {t('transHint')}
        </p>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>{t('destTagline')}</label>
          <input
            className={styles.formInput}
            value={tr.tagline}
            onChange={e => updateTrans(locale, 'tagline', e.target.value)}
            placeholder={form.tagline}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>{t('destDescription')}</label>
          <textarea
            className={styles.formTextarea}
            value={tr.description}
            onChange={e => updateTrans(locale, 'description', e.target.value)}
            placeholder={form.description}
          />
        </div>
      </>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('destTitle')}</h1>
          <p className={styles.subtitle}>{destinations.length} {t('toursTotal')}</p>
        </div>
        {!showForm && (
          <button className={styles.addBtn} onClick={openAdd}>
            {t('destNewBtn')}
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>
            {editingId !== null ? t('destEditTitle') : t('destNewTitle')}
          </h2>

          <div style={{ display: 'flex', gap: 0, marginBottom: 'var(--space-5)', borderBottom: '2px solid var(--color-border-4)' }}>
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                style={{
                  padding: 'var(--space-2) var(--space-5)',
                  border: 'none',
                  background: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  color: activeLocale === loc ? 'var(--color-accent)' : 'var(--color-text-3)',
                  cursor: 'pointer',
                  borderBottom: activeLocale === loc ? '2px solid var(--color-accent)' : '2px solid transparent',
                  marginBottom: -2,
                }}
                onClick={() => setActiveLocale(loc)}
              >
                {t(`trans${loc === 'de' ? 'German' : loc === 'en' ? 'English' : 'Russian'}`)}
              </button>
            ))}
          </div>

          <div className={styles.formRow}>
            {activeLocale === 'de' ? (
              <>
                <div className={styles.formRowInline}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('destName')}</label>
                    <input
                      className={styles.formInput}
                      value={form.name}
                      onChange={e => handleNameChange(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('destSlug')}</label>
                    <input
                      className={styles.formInput}
                      value={form.slug}
                      onChange={e => { setForm({ ...form, slug: e.target.value }); setAutoSlug(false); }}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t('destTagline')}</label>
                  <input
                    className={styles.formInput}
                    value={form.tagline}
                    onChange={e => setForm({ ...form, tagline: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t('destDescription')}</label>
                  <textarea
                    className={styles.formTextarea}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t('destImageUrl')}</label>
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                    folder="hurghada-reiseplaner/destinations"
                    label={t('destImageUrl')}
                  />
                </div>
              </>
            ) : (
              renderTransFields(activeLocale)
            )}
          </div>
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? t('tourSave') : t('destSave')}
            </button>
            <button className={styles.cancelBtn} onClick={cancelForm}>
              {t('destCancel')}
            </button>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('destColName')}</th>
              <th>Slug</th>
              <th>{t('tourImage')}</th>
              <th>{t('destColTagline')}</th>
              <th>{t('transTabContent')}</th>
              <th>{t('colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}>{t('loading')}</td></tr>
            ) : destinations.length === 0 ? (
              <tr><td colSpan={6} className={styles.empty}>{t('destNoResults')}</td></tr>
            ) : (
              destinations.map(dest => (
                <tr key={dest.id}>
                  <td className={styles.nameCell}>{dest.name}</td>
                  <td className={styles.slugCell}>{dest.slug}</td>
                  <td>
                    {dest.image ? (
                      <img src={dest.image} alt={dest.name} className={styles.imagePreview} />
                    ) : (
                      <span style={{ color: 'var(--color-text-3)', fontSize: 13 }}>—</span>
                    )}
                  </td>
                  <td className={styles.taglineCell}>{dest.tagline || '—'}</td>
                  <td>
                    <span className={styles.badge}>
                      {(dest.translations ?? []).filter(tr => tr.tagline || tr.description).length} / 2
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(dest)}>
                        {t('edit')}
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(dest.id)}>
                        {t('delete')}
                      </button>
                    </div>
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
