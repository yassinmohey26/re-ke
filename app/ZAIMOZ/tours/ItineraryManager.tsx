'use client';

import { useEffect, useState } from 'react';
import { useAdminLocale } from '../AdminLanguageContext';

interface ItineraryItem {
  title: string;
  content: string;
}

interface ItineraryManagerProps {
  tourId: string;
  styles: { [key: string]: string };
}

const emptyItem = { title: '', content: '' };

const reorderBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'inherit',
  borderRadius: '4px',
  padding: '2px 6px',
  cursor: 'pointer',
  fontSize: '10px',
  lineHeight: 1,
};

export default function ItineraryManager({ tourId, styles }: ItineraryManagerProps) {
  const { locale } = useAdminLocale();
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<ItineraryItem>(emptyItem);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId, locale]);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/tours/${tourId}/itinerary?locale=${locale}`);
    if (res.ok) {
      const data = await res.json();
      setItems(Array.isArray(data.itinerary) ? data.itinerary : []);
    } else {
      setItems([]);
    }
    setLoading(false);
  }

  function startAdd() {
    setForm(emptyItem);
    setEditingIndex('new');
  }

  function startEdit(index: number) {
    setForm({ ...items[index] });
    setEditingIndex(index);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setForm(emptyItem);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    setItems(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    if (!confirm('Delete this itinerary item?')) return;
    setItems(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEdit();
  }

  function commitEdit() {
    if (!form.title.trim() && !form.content.trim()) {
      cancelEdit();
      return;
    }
    const item = { title: form.title.trim(), content: form.content.trim() };
    if (editingIndex === 'new') {
      setItems(prev => [...prev, item]);
    } else if (editingIndex !== null) {
      setItems(prev => prev.map((it, i) => (i === editingIndex ? item : it)));
    }
    cancelEdit();
  }

  async function saveItinerary() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tours/${tourId}/itinerary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: items, locale }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save itinerary');
      }
      cancelEdit();
      await load();
      alert(`${locale.toUpperCase()} itinerary saved.`);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error saving itinerary');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Reiseverlauf ({locale === 'de' ? 'Deutsch – master' : locale.toUpperCase()})</h2>
      <p style={{ fontSize: '12px', color: 'var(--color-text-3)', marginBottom: 'var(--space-3)' }}>
        {locale === 'de'
          ? 'German itinerary is the master and is saved to the tours table. Other languages have their own independent itinerary.'
          : `${locale.toUpperCase()} itinerary is stored separately. Saving here never touches German or any other locale.`}
      </p>

      {loading ? (
        <p>Loading itinerary...</p>
      ) : (
        <table style={{ width: '100%', marginBottom: 'var(--space-3)', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px' }}>#</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Content</th>
              <th style={{ padding: '8px' }} />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} style={reorderBtnStyle}>▲</button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} style={reorderBtnStyle}>▼</button>
                  </div>
                </td>
                <td style={{ padding: '8px' }}>{item.title || <span style={{ opacity: 0.6 }}>—</span>}</td>
                <td style={{ padding: '8px', opacity: 0.8 }}>{item.content}</td>
                <td style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => startEdit(index)} className={styles.slugBtn}>Edit</button>
                  <button type="button" onClick={() => remove(index)} className={styles.cancelBtn}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '8px', opacity: 0.7 }}>No itinerary items yet.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {editingIndex !== null ? (
        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Content</label>
            <textarea className={styles.textarea} rows={3} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
            <button type="button" onClick={commitEdit} className={styles.saveBtn}>
              {editingIndex === 'new' ? 'Add item' : 'Update item'}
            </button>
            <button type="button" onClick={cancelEdit} className={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={startAdd} className={styles.slugBtn}>+ Add item</button>
      )}

      <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button type="button" onClick={saveItinerary} disabled={saving || loading} className={styles.saveBtn}>
          {saving ? 'Saving...' : `Save ${locale.toUpperCase()} itinerary`}
        </button>
        {!loading && <span style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>{items.length} item(s)</span>}
      </div>
    </div>
  );
}
