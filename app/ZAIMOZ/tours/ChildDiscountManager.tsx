'use client';

import { useEffect, useState } from 'react';
import type { ChildDiscountType } from '@/lib/child-discounts';

export interface ChildDiscountFormTier {
  id?: string;
  ageFrom: number;
  ageTo: number | null;
  discountType: ChildDiscountType;
  discountValue: number | null;
  sortOrder: number;
}

interface ChildDiscountManagerProps {
  tourId: string;
  styles: { [key: string]: string };
}

interface ChildDiscountManagerCreateProps {
  tiers: ChildDiscountFormTier[];
  onChange: (tiers: ChildDiscountFormTier[]) => void;
  styles: { [key: string]: string };
}

const emptyTier = (): ChildDiscountFormTier => ({
  ageFrom: 0,
  ageTo: 2,
  discountType: 'free',
  discountValue: null,
  sortOrder: 0,
});

function dbRowToForm(row: Record<string, unknown>): ChildDiscountFormTier {
  return {
    id: typeof row.id === 'string' ? row.id : undefined,
    ageFrom: Number(row.age_from ?? 0),
    ageTo: row.age_to == null ? null : Number(row.age_to),
    discountType: row.discount_type as ChildDiscountType,
    discountValue: row.discount_value == null ? null : Number(row.discount_value),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function validateTierSequence(tiers: ChildDiscountFormTier[]): string | null {
  if (tiers.length === 0) return null;

  for (let index = 0; index < tiers.length; index += 1) {
    const tier = tiers[index];
    if (!Number.isInteger(tier.ageFrom) || tier.ageFrom < 0) {
      return 'Das Startalter muss eine ganze Zahl ab 0 sein.';
    }
    if (tier.ageTo != null && (!Number.isInteger(tier.ageTo) || tier.ageTo < tier.ageFrom)) {
      return 'Das Endalter darf nicht kleiner als das Startalter sein.';
    }
    if (tier.discountType === 'percentage' && (tier.discountValue == null || tier.discountValue < 0 || tier.discountValue > 100)) {
      return 'Der prozentuale Rabatt muss zwischen 0 und 100 liegen.';
    }
    if (tier.discountType === 'fixed_price' && (tier.discountValue == null || tier.discountValue < 0)) {
      return 'Der feste Preis darf nicht negativ sein.';
    }

    if (index === 0 && tier.ageFrom !== 0) {
      return 'Die erste Altersstufe muss bei 0 beginnen.';
    }
    if (index === 0) continue;

    const previous = tiers[index - 1];
    if (previous.ageTo == null) {
      return 'Eine offene Altersstufe muss die letzte Stufe sein.';
    }
    const expectedStart = previous.ageTo + 1;
    if (tier.ageFrom < expectedStart) {
      return `Die Altersstufen überschneiden sich bei ${tier.ageFrom}.`;
    }
    if (tier.ageFrom > expectedStart) {
      return `Zwischen ${previous.ageTo} und ${tier.ageFrom} besteht eine Lücke.`;
    }
  }

  return null;
}

function showTierValidationError(tiers: ChildDiscountFormTier[]): boolean {
  const error = validateTierSequence(tiers);
  if (!error) return false;
  alert(error);
  return true;
}

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

function TierEditor({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
  styles,
  isNew,
}: {
  form: ChildDiscountFormTier;
  setForm: React.Dispatch<React.SetStateAction<ChildDiscountFormTier>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  styles: { [key: string]: string };
  isNew: boolean;
}) {
  const showValue = form.discountType === 'percentage' || form.discountType === 'fixed_price';

  return (
    <div className={styles.row3}>
      <div className={styles.field}>
        <label className={styles.label}>Alter von</label>
        <input
          className={styles.input}
          type="number"
          min={0}
          value={form.ageFrom}
          onChange={e => setForm(f => ({ ...f, ageFrom: Math.max(0, parseInt(e.target.value, 10) || 0) }))}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Alter bis (leer = und älter)</label>
        <input
          className={styles.input}
          type="number"
          min={0}
          value={form.ageTo ?? ''}
          placeholder="∞"
          onChange={e => {
            const v = e.target.value;
            setForm(f => ({
              ...f,
              ageTo: v === '' ? null : Math.max(0, parseInt(v, 10) || 0),
            }));
          }}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Art</label>
        <select
          className={styles.input}
          value={form.discountType}
          onChange={e => {
            const discountType = e.target.value as ChildDiscountType;
            setForm(f => ({
              ...f,
              discountType,
              discountValue:
                discountType === 'percentage' ? (f.discountValue ?? 50) : discountType === 'fixed_price' ? (f.discountValue ?? 0) : null,
            }));
          }}
        >
          <option value="free">Kostenlos</option>
          <option value="percentage">Prozent</option>
          <option value="full_price">Voller Preis</option>
          <option value="fixed_price">Fester Preis (€)</option>
        </select>
      </div>
      {showValue && (
        <div className={styles.field}>
          <label className={styles.label}>
            {form.discountType === 'percentage' ? 'Prozent' : 'Preis (€)'}
          </label>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={form.discountValue ?? ''}
            onChange={e =>
              setForm(f => ({
                ...f,
                discountValue: e.target.value === '' ? null : Number(e.target.value),
              }))
            }
          />
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
        <button type="button" onClick={onSave} disabled={saving} className={styles.saveBtn}>
          {saving ? 'Speichern…' : isNew ? 'Hinzufügen' : 'Aktualisieren'}
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Abbrechen
        </button>
      </div>
    </div>
  );
}

export function ChildDiscountEditor({
  tiers,
  onChange,
  styles,
}: ChildDiscountManagerCreateProps) {
  const [editingIndex, setEditingIndex] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<ChildDiscountFormTier>(emptyTier());

  function startAdd() {
    setForm({ ...emptyTier(), sortOrder: tiers.length });
    setEditingIndex('new');
  }

  function startEdit(index: number) {
    setForm({ ...tiers[index] });
    setEditingIndex(index);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setForm(emptyTier());
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= tiers.length) return;
    const next = [...tiers];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((t, i) => ({ ...t, sortOrder: i }));
    if (showTierValidationError(reordered)) return;
    onChange(reordered);
  }

  function remove(index: number) {
    if (!confirm('Diese Altersstufe löschen?')) return;
    const next = tiers.filter((_, i) => i !== index).map((t, i) => ({ ...t, sortOrder: i }));
    if (showTierValidationError(next)) return;
    onChange(next);
    if (editingIndex === index) cancelEdit();
  }

  function commitEdit() {
    const item = { ...form };
    const next = editingIndex === 'new'
      ? [...tiers, { ...item, sortOrder: tiers.length }]
      : tiers.map((tier, index) => (index === editingIndex ? { ...item, sortOrder: index } : tier));
    if (showTierValidationError(next)) return;
    if (editingIndex === 'new') {
      onChange([...tiers, { ...item, sortOrder: tiers.length }]);
    } else if (editingIndex !== null) {
      onChange(tiers.map((t, i) => (i === editingIndex ? { ...item, sortOrder: i } : t)));
    }
    cancelEdit();
  }

  return (
    <details className={`${styles.section} ${styles.collapsibleSection}`} open>
      <summary className={styles.sectionSummary}>
        <span>Kinderermäßigung</span>
        <span className={styles.sectionChevron} aria-hidden="true">⌄</span>
      </summary>
      <div className={styles.collapsibleContent}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-3)', marginBottom: 'var(--space-3)' }}>
        Leer lassen = Standard (0–2 kostenlos, 3–10 50 %, ab 11 voller Preis) auf der Website.
      </p>

      <table className={styles.managerTable} style={{ width: '100%', marginBottom: 'var(--space-3)', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>#</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Alter</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Preis</th>
            <th style={{ padding: '8px' }} />
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, index) => (
            <tr key={tier.id ?? index} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <td data-label="Reihenfolge" style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} style={reorderBtnStyle}>▲</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === tiers.length - 1} style={reorderBtnStyle}>▼</button>
                </div>
              </td>
              <td data-label="Alter" style={{ padding: '8px' }}>
                {tier.ageTo == null ? `${tier.ageFrom}+` : `${tier.ageFrom}–${tier.ageTo}`}
              </td>
              <td data-label="Preis" style={{ padding: '8px' }}>{tier.discountType}{tier.discountValue != null ? ` (${tier.discountValue})` : ''}</td>
              <td data-label="Aktionen" style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => startEdit(index)} className={styles.slugBtn}>Edit</button>
                <button type="button" onClick={() => remove(index)} className={styles.cancelBtn}>Delete</button>
              </td>
            </tr>
          ))}
          {tiers.length === 0 && (
            <tr><td colSpan={4} style={{ padding: '8px', opacity: 0.7 }}>Keine eigenen Stufen — Standard wird verwendet.</td></tr>
          )}
        </tbody>
      </table>

      {editingIndex !== null ? (
        <TierEditor
          form={form}
          setForm={setForm}
          onSave={commitEdit}
          onCancel={cancelEdit}
          saving={false}
          styles={styles}
          isNew={editingIndex === 'new'}
        />
      ) : (
        <button type="button" onClick={startAdd} className={styles.slugBtn}>+ Altersstufe</button>
      )}
      </div>
    </details>
  );
}

export default function ChildDiscountManager({ tourId, styles }: ChildDiscountManagerProps) {
  const [tiers, setTiers] = useState<ChildDiscountFormTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<ChildDiscountFormTier>(emptyTier());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/tours/${tourId}/child-discounts`);
    if (res.ok) {
      const data = await res.json();
      setTiers(Array.isArray(data) ? data.map(dbRowToForm) : []);
    } else {
      setTiers([]);
    }
    setLoading(false);
  }

  function startAdd() {
    setForm({ ...emptyTier(), sortOrder: tiers.length });
    setEditingIndex('new');
  }

  function startEdit(index: number) {
    setForm({ ...tiers[index] });
    setEditingIndex(index);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setForm(emptyTier());
  }

  async function save() {
    const next = editingIndex === 'new'
      ? [...tiers, { ...form, sortOrder: tiers.length }]
      : tiers.map((tier, index) => (index === editingIndex ? { ...form, sortOrder: index } : tier));
    if (showTierValidationError(next)) return;
    setSaving(true);
    try {
      const payload = {
        ageFrom: form.ageFrom,
        ageTo: form.ageTo,
        discountType: form.discountType,
        discountValue: form.discountValue,
        sortOrder: form.sortOrder,
      };
      if (editingIndex === 'new') {
        const res = await fetch(`/api/admin/tours/${tourId}/child-discounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create tier');
      } else if (editingIndex !== null && form.id) {
        const res = await fetch(`/api/admin/child-discounts/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update tier');
      }
      cancelEdit();
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error saving tier');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string | undefined, index: number) {
    const next = tiers.filter((_, tierIndex) => tierIndex !== index).map((tier, tierIndex) => ({ ...tier, sortOrder: tierIndex }));
    if (showTierValidationError(next)) return;
    if (!id) {
      setTiers(next);
      return;
    }
    if (!confirm('Diese Altersstufe löschen?')) return;
    const res = await fetch(`/api/admin/child-discounts/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
    else alert('Failed to delete tier');
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= tiers.length) return;
    const next = [...tiers];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((t, i) => ({ ...t, sortOrder: i }));
    if (showTierValidationError(reordered)) return;
    setTiers(reordered);
    const res = await fetch(`/api/admin/tours/${tourId}/child-discounts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: reordered.map(t => ({
          ageFrom: t.ageFrom,
          ageTo: t.ageTo,
          discountType: t.discountType,
          discountValue: t.discountValue,
          sortOrder: t.sortOrder,
        })),
      }),
    });
    if (!res.ok) {
      alert('Failed to reorder');
      await load();
    }
  }

  if (loading) {
    return (
      <details className={`${styles.section} ${styles.collapsibleSection}`} open>
        <summary className={styles.sectionSummary}>
          <span>Kinderermäßigung</span>
          <span className={styles.sectionChevron} aria-hidden="true">⌄</span>
        </summary>
        <div className={styles.collapsibleContent}>
        <p>Loading…</p>
        </div>
      </details>
    );
  }

  return (
    <details className={`${styles.section} ${styles.collapsibleSection}`} open>
      <summary className={styles.sectionSummary}>
        <span>Kinderermäßigung</span>
        <span className={styles.sectionChevron} aria-hidden="true">⌄</span>
      </summary>
      <div className={styles.collapsibleContent}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-3)', marginBottom: 'var(--space-3)' }}>
        Keine Stufen = Standard auf der Website (0–2 kostenlos, 3–10 50 %, ab 11 voller Preis).
      </p>

      <table className={styles.managerTable} style={{ width: '100%', marginBottom: 'var(--space-3)', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>#</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Alter</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Art</th>
            <th style={{ padding: '8px' }} />
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, index) => (
            <tr key={tier.id ?? index} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <td data-label="Reihenfolge" style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} style={reorderBtnStyle}>▲</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === tiers.length - 1} style={reorderBtnStyle}>▼</button>
                </div>
              </td>
              <td data-label="Alter" style={{ padding: '8px' }}>
                {tier.ageTo == null ? `${tier.ageFrom}+` : `${tier.ageFrom}–${tier.ageTo}`}
              </td>
              <td data-label="Art" style={{ padding: '8px' }}>
                {tier.discountType}
                {tier.discountValue != null ? ` (${tier.discountValue})` : ''}
              </td>
              <td data-label="Aktionen" style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => startEdit(index)} className={styles.slugBtn}>Edit</button>
                <button type="button" onClick={() => remove(tier.id, index)} className={styles.cancelBtn}>Delete</button>
              </td>
            </tr>
          ))}
          {tiers.length === 0 && (
            <tr><td colSpan={4} style={{ padding: '8px', opacity: 0.7 }}>Keine eigenen Stufen.</td></tr>
          )}
        </tbody>
      </table>

      {editingIndex !== null ? (
        <TierEditor
          form={form}
          setForm={setForm}
          onSave={save}
          onCancel={cancelEdit}
          saving={saving}
          styles={styles}
          isNew={editingIndex === 'new'}
        />
      ) : (
        <button type="button" onClick={startAdd} className={styles.slugBtn}>+ Altersstufe</button>
      )}
      </div>
    </details>
  );
}

export function childDiscountFormToPayload(tiers: ChildDiscountFormTier[]) {
  return tiers.map((t, index) => ({
    ageFrom: t.ageFrom,
    ageTo: t.ageTo,
    discountType: t.discountType,
    discountValue: t.discountValue,
    sortOrder: index,
  }));
}
