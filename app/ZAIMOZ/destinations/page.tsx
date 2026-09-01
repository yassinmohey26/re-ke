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
  display_order: number | null;
}

interface DestinationTour { id: string; name: string; destination: string; }

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
  const { t, locale } = useAdminLocale();
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
  const [destinationTours, setDestinationTours] = useState<DestinationTour[]>([]);
  const [selectedTourIds, setSelectedTourIds] = useState<string[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [toursSaving, setToursSaving] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [orderedDestinations, setOrderedDestinations] = useState<Destination[]>([]);
  const [reorderSaving, setReorderSaving] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => { fetchDestinations(); }, []);

  async function fetchDestinations() {
    try {
      const res = await fetch('/api/admin/destinations');
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
        setOrderedDestinations(data);
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
    setToursLoading(true);
    fetch(`/api/admin/destinations/${dest.id}/tours?locale=${locale}`)
      .then(res => res.json())
      .then(data => {
        setDestinationTours(Array.isArray(data.tours) ? data.tours : []);
        setSelectedTourIds(Array.isArray(data.selectedTourIds) ? data.selectedTourIds : []);
      })
      .finally(() => setToursLoading(false));
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setDestinationTours([]);
    setSelectedTourIds([]);
  }

  function moveDestination(fromId: string, toId: string) {
    setOrderedDestinations(current => {
      const next = [...current];
      const fromIndex = next.findIndex(destination => destination.id === fromId);
      const toIndex = next.findIndex(destination => destination.id === toId);
      if (fromIndex === -1 || toIndex === -1) return current;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  async function saveDestinationOrder() {
    setReorderSaving(true);
    try {
      const response = await fetch('/api/admin/destinations/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationIds: orderedDestinations.map(destination => destination.id) }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        alert(error.error || 'Failed to save destination order');
        return;
      }
      setDestinations(orderedDestinations);
      setReorderMode(false);
      await fetchDestinations();
    } finally {
      setReorderSaving(false);
    }
  }

  async function saveDestinationTours() {
    if (!editingId) return;
    setToursSaving(true);
    await fetch(`/api/admin/destinations/${editingId}/tours`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tourIds: selectedTourIds }),
    });
    setToursSaving(false);
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
        {!showForm && <div className={styles.headerActions}>
          <button className={styles.reorderBtn} onClick={() => { setOrderedDestinations(destinations); setReorderMode(true); }}>
            Reorder homepage
          </button>
          <button className={styles.addBtn} onClick={openAdd}>{t('destNewBtn')}</button>
        </div>}
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
            {editingId && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('destinationTours')}</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <button type="button" className={styles.editBtn} disabled={toursLoading}
                    onClick={() => setSelectedTourIds(destinationTours.map(tour => tour.id))}>{t('selectAllTours')}</button>
                  <button type="button" className={styles.editBtn} disabled={toursLoading}
                    onClick={() => setSelectedTourIds([])}>{t('deselectAllTours')}</button>
                </div>
                <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #ddd', padding: 10 }}>
                  {toursLoading ? t('loading') : destinationTours.map(tour => (
                    <label key={tour.id} style={{ display: 'block', padding: '5px 0' }}>
                      <input type="checkbox" checked={selectedTourIds.includes(tour.id)}
                        onChange={event => setSelectedTourIds(current => event.target.checked
                          ? [...current, tour.id]
                          : current.filter(id => id !== tour.id))} />{' '}
                      {tour.name}
                    </label>
                  ))}
                </div>
                <button type="button" className={styles.saveBtn} onClick={saveDestinationTours} disabled={toursSaving}>
                  {toursSaving ? t('tourSave') : t('saveTourSelection')}
                </button>
              </div>
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

      {loading ? (
        <p className={styles.loading}>{t('loading')}</p>
      ) : destinations.length === 0 ? (
        <p className={styles.empty}>{t('destNoResults')}</p>
      ) : reorderMode ? (
        <div className={styles.reorderCard}>
          <div className={styles.reorderHeader}>
            <div><h2 className={styles.formTitle}>Homepage destination order</h2><p className={styles.reorderHint}>Drag destinations into the order you want visitors to see.</p></div>
            <div className={styles.formActions}>
              <button className={styles.saveBtn} onClick={saveDestinationOrder} disabled={reorderSaving}>{reorderSaving ? 'Saving…' : 'Save order'}</button>
              <button className={styles.cancelBtn} onClick={() => { setReorderMode(false); setOrderedDestinations(destinations); }}>Cancel</button>
            </div>
          </div>
          <div className={styles.reorderList}>
            {orderedDestinations.map((dest, index) => (
              <div key={dest.id} className={styles.reorderItem} draggable onDragStart={() => setDraggedId(dest.id)} onDragOver={event => event.preventDefault()} onDrop={() => { if (draggedId) moveDestination(draggedId, dest.id); setDraggedId(null); }}>
                <span className={styles.dragHandle} aria-label="Drag destination">⋮⋮</span>
                <span className={styles.orderNumber}>{index + 1}</span>
                {dest.image && <img src={dest.image} alt="" className={styles.reorderImage} />}
                <span className={styles.reorderName}>{dest.name}</span>
                <div className={styles.reorderMoves}>
                  <button className={styles.moveBtn} disabled={index === 0} onClick={() => moveDestination(dest.id, orderedDestinations[index - 1].id)} aria-label="Move up">↑</button>
                  <button className={styles.moveBtn} disabled={index === orderedDestinations.length - 1} onClick={() => moveDestination(dest.id, orderedDestinations[index + 1].id)} aria-label="Move down">↓</button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
