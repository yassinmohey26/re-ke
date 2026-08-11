'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';
import { useAdminLocale } from '../AdminLanguageContext';
import LocalePicker from '@/components/admin/LocalePicker';
import styles from './page.module.css';

interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
}

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
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

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
    setFormError('');
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
    setFormError('');
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  function handleNameChange(name: string) {
    setForm(prev => ({
      ...prev,
      name,
      slug: autoSlug ? slugify(name) : prev.slug,
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    setFormError('');

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      tagline: form.tagline || '',
      description: form.description || '',
      image: form.image || '',
    };

    try {
      const res = editingId !== null
        ? await fetch(`/api/admin/destinations/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/destinations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        await fetchDestinations();
        cancelForm();
      } else {
        const err = await res.json().catch(() => ({ error: `Save failed (HTTP ${res.status})` }));
        setFormError(err.error || `Save failed (HTTP ${res.status})`);
      }
    } catch (e) {
      console.error('Failed to save destination:', e);
      setFormError('Failed to save destination');
    }

    setSaving(false);
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

  async function handleDuplicate(dupLocale: string) {
    if (!duplicateId) return;
    const res = await fetch('/api/admin/duplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'destinations', id: duplicateId, locale: dupLocale }),
    });
    setDuplicateId(null);
    if (res.ok) {
      router.push(`/ZAIMOZ/destinations`);
    } else {
      const err = await res.json();
      alert(err.error || 'Duplicate failed');
    }
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

          <div className={styles.formRow}>
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
            {formError && <p className={styles.formError}>{formError}</p>}
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

      {loading ? (
        <p className={styles.loading}>{t('loading')}</p>
      ) : destinations.length === 0 ? (
        <p className={styles.empty}>{t('destNoResults')}</p>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('destColName')}</th>
                  <th>Slug</th>
                  <th>{t('tourImage')}</th>
                  <th>{t('destColTagline')}</th>
                  <th>{t('colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map(dest => (
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
                      <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => openEdit(dest)}>
                          {t('edit')}
                        </button>
                        <button className={styles.editBtn} onClick={() => setDuplicateId(dest.id)}>
                          {t('duplicateBtn')}
                        </button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(dest.id)}>
                          {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card list ── */}
          <div className={styles.mobileCardList}>
            {destinations.map(dest => (
              <div key={dest.id} className={styles.mobileCard}>
                <div className={styles.mobileCardTop}>
                  {dest.image && (
                    <img src={dest.image} alt={dest.name} className={styles.mobileCardImage} />
                  )}
                  <div className={styles.mobileCardTitleBlock}>
                    <p className={styles.mobileCardName}>{dest.name}</p>
                    <p className={styles.mobileCardSlug}>{dest.slug}</p>
                  </div>
                </div>

                <div className={styles.mobileCardMeta}>
                  <div className={styles.mobileCardMetaItem}>
                    <span className={styles.mobileCardMetaLabel}>{t('destColTagline')}</span>
                    <span className={styles.mobileCardMetaValue}>{dest.tagline || '—'}</span>
                  </div>
                </div>

                <div className={styles.mobileCardActions}>
                  <button className={styles.editBtn} onClick={() => openEdit(dest)}>
                    {t('edit')}
                  </button>
                  <button className={styles.editBtn} onClick={() => setDuplicateId(dest.id)}>
                    {t('duplicateBtn')}
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(dest.id)}>
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
