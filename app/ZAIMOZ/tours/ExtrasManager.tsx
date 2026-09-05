'use client';

import { useEffect, useState } from 'react';

interface Extra {
  id: string;
  tour_id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  sort_order: number;
}

interface ExtrasManagerProps {
  tourId: string;
  styles: { [key: string]: string };
}

const emptyExtra = { name: '', description: '', price: 0, active: true, sortOrder: 0 };

export default function ExtrasManager({ tourId, styles }: ExtrasManagerProps) {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState(emptyExtra);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/tours/${tourId}/extras`);
    if (res.ok) setExtras(await res.json());
    setLoading(false);
  }

  function startAdd() {
    setForm(emptyExtra);
    setEditingId('new');
  }

  function startEdit(extra: Extra) {
    setForm({
      name: extra.name,
      description: extra.description || '',
      price: extra.price,
      active: extra.active,
      sortOrder: extra.sort_order,
    });
    setEditingId(extra.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyExtra);
  }

  async function save() {
    setSaving(true);
    try {
      if (editingId === 'new') {
        const res = await fetch(`/api/admin/tours/${tourId}/extras`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Failed to create extra');
      } else if (editingId) {
        const res = await fetch(`/api/admin/extras/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Failed to update extra');
      }
      cancelEdit();
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error saving extra');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this extra?')) return;
    const res = await fetch(`/api/admin/extras/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
    else alert('Failed to delete extra');
  }

  return (
    <details className={`${styles.section} ${styles.collapsibleSection}`}>
      <summary className={styles.sectionSummary}>
        <span>Extras</span>
        <span className={styles.sectionChevron} aria-hidden="true">⌄</span>
      </summary>
      <div className={styles.collapsibleContent}>

      {loading ? (
        <p>Loading extras...</p>
      ) : (
        <table className={styles.managerTable} style={{ width: '100%', marginBottom: 'var(--space-3)', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Price (€)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Active</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Order</th>
              <th style={{ padding: '8px' }} />
            </tr>
          </thead>
          <tbody>
            {extras.map(extra => (
              <tr key={extra.id} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <td data-label="Name" style={{ padding: '8px' }}>{extra.name}</td>
                <td data-label="Price (€)" style={{ padding: '8px' }}>{extra.price.toFixed(2)}</td>
                <td data-label="Active" style={{ padding: '8px' }}>{extra.active ? 'Yes' : 'No'}</td>
                <td data-label="Order" style={{ padding: '8px' }}>{extra.sort_order}</td>
                <td data-label="Actions" style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => startEdit(extra)} className={styles.slugBtn}>Edit</button>
                  <button type="button" onClick={() => remove(extra.id)} className={styles.cancelBtn}>Delete</button>
                </td>
              </tr>
            ))}
            {extras.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '8px', opacity: 0.7 }}>No extras yet.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {editingId ? (
        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Price (€)</label>
            <input
              className={styles.input}
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sort order</label>
            <input
              className={styles.input}
              type="number"
              value={form.sortOrder}
              onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
            />
          </div>
          <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
            />
            <span>Active</span>
          </label>
          <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
            <button type="button" onClick={save} disabled={saving} className={styles.saveBtn}>
              {saving ? 'Saving...' : 'Save extra'}
            </button>
            <button type="button" onClick={cancelEdit} className={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={startAdd} className={styles.slugBtn}>+ Add extra</button>
      )}
      </div>
    </details>
  );
}
