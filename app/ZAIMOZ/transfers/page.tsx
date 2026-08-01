'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface TransferRow {
  id: string;
  destination: string;
  car_price: number;
  minibus_price: number;
  sort_order: number;
}

const EMPTY_ROW: Omit<TransferRow, 'id'> = {
  destination: '',
  car_price: 0,
  minibus_price: 0,
  sort_order: 0,
};

export default function TransfersAdminPage() {
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null); // id of row being saved
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ ...EMPTY_ROW });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/transfers');
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function flash(msg: string, isError = false) {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 2000); }
  }

  function updateLocal(id: string, field: keyof TransferRow, value: string | number) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  async function saveRow(row: TransferRow) {
    setSaving(row.id);
    const res = await fetch('/api/admin/transfers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
    setSaving(null);
    if (res.ok) flash('✓ Saved');
    else flash('Save failed', true);
  }

  async function deleteRow(id: string) {
    if (!confirm('Delete this row?')) return;
    const res = await fetch('/api/admin/transfers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { setRows(prev => prev.filter(r => r.id !== id)); flash('✓ Deleted'); }
    else flash('Delete failed', true);
  }

  async function addRow() {
    if (!newRow.destination.trim()) return;
    const res = await fetch('/api/admin/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRow, sort_order: rows.length }),
    });
    if (res.ok) {
      const created = await res.json();
      setRows(prev => [...prev, created]);
      setNewRow({ ...EMPTY_ROW });
      setAdding(false);
      flash('✓ Added');
    } else flash('Add failed', true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>✈️ Airport Transfer Prices</h1>
          <p className={styles.subtitle}>Edit the PKW &amp; Minibus pricing table shown on the airport transfer page.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setAdding(true)}>+ Add Row</button>
      </div>

      {error   && <div className={styles.errorBanner}>{error}</div>}
      {success && <div className={styles.successBanner}>{success}</div>}

      {loading ? (
        <div className={styles.loadingState}>Loading…</div>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Sort</th>
                  <th className={styles.th}>Destination (ZIEL)</th>
                  <th className={styles.th}>PKW Price (€)</th>
                  <th className={styles.th}>Minibus Price (€)</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id} className={styles.tr}>
                    <td className={styles.td}>
                      <input
                        type="number"
                        className={styles.inputSmall}
                        value={row.sort_order}
                        onChange={e => updateLocal(row.id, 'sort_order', Number(e.target.value))}
                      />
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.inputDest}
                        value={row.destination}
                        onChange={e => updateLocal(row.id, 'destination', e.target.value)}
                      />
                    </td>
                    <td className={styles.td}>
                      <div className={styles.priceCell}>
                        <input
                          type="number"
                          className={styles.inputPrice}
                          value={row.car_price}
                          onChange={e => updateLocal(row.id, 'car_price', Number(e.target.value))}
                        />
                        <span className={styles.euro}>€</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.priceCell}>
                        <input
                          type="number"
                          className={styles.inputPrice}
                          value={row.minibus_price}
                          onChange={e => updateLocal(row.id, 'minibus_price', Number(e.target.value))}
                        />
                        <span className={styles.euro}>€</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <button
                          className={styles.saveBtn}
                          onClick={() => saveRow(row)}
                          disabled={saving === row.id}
                        >
                          {saving === row.id ? '…' : 'Save'}
                        </button>
                        <button className={styles.deleteBtn} onClick={() => deleteRow(row.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Add new row inline */}
                {adding && (
                  <tr className={`${styles.tr} ${styles.trNew}`}>
                    <td className={styles.td}>
                      <input
                        type="number"
                        className={styles.inputSmall}
                        value={newRow.sort_order}
                        onChange={e => setNewRow(p => ({ ...p, sort_order: Number(e.target.value) }))}
                      />
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.inputDest}
                        placeholder="e.g. El Gouna"
                        value={newRow.destination}
                        onChange={e => setNewRow(p => ({ ...p, destination: e.target.value }))}
                        autoFocus
                      />
                    </td>
                    <td className={styles.td}>
                      <div className={styles.priceCell}>
                        <input
                          type="number"
                          className={styles.inputPrice}
                          value={newRow.car_price}
                          onChange={e => setNewRow(p => ({ ...p, car_price: Number(e.target.value) }))}
                        />
                        <span className={styles.euro}>€</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.priceCell}>
                        <input
                          type="number"
                          className={styles.inputPrice}
                          value={newRow.minibus_price}
                          onChange={e => setNewRow(p => ({ ...p, minibus_price: Number(e.target.value) }))}
                        />
                        <span className={styles.euro}>€</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <button className={styles.saveBtn} onClick={addRow}>Add</button>
                        <button className={styles.deleteBtn} onClick={() => { setAdding(false); setNewRow({ ...EMPTY_ROW }); }}>✕</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {rows.length === 0 && !adding && (
              <div className={styles.empty}>No rows yet. Click "+ Add Row" to add the first destination.</div>
            )}
          </div>

          {/* ── Mobile card list ── */}
          <div className={styles.mobileCardList}>
            {rows.map(row => (
              <div key={row.id} className={styles.mobileCard}>
                <div className={styles.mobileCardField}>
                  <label className={styles.mobileCardLabel}>Destination</label>
                  <input
                    className={styles.inputDest}
                    value={row.destination}
                    onChange={e => updateLocal(row.id, 'destination', e.target.value)}
                  />
                </div>
                <div className={styles.mobileCardPriceRow}>
                  <div className={styles.mobileCardField}>
                    <label className={styles.mobileCardLabel}>PKW (€)</label>
                    <input
                      type="number"
                      className={styles.inputPrice}
                      value={row.car_price}
                      onChange={e => updateLocal(row.id, 'car_price', Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.mobileCardField}>
                    <label className={styles.mobileCardLabel}>Minibus (€)</label>
                    <input
                      type="number"
                      className={styles.inputPrice}
                      value={row.minibus_price}
                      onChange={e => updateLocal(row.id, 'minibus_price', Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.mobileCardField}>
                    <label className={styles.mobileCardLabel}>Sort</label>
                    <input
                      type="number"
                      className={styles.inputSmall}
                      value={row.sort_order}
                      onChange={e => updateLocal(row.id, 'sort_order', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className={styles.mobileCardActions}>
                  <button
                    className={styles.saveBtn}
                    onClick={() => saveRow(row)}
                    disabled={saving === row.id}
                  >
                    {saving === row.id ? '…' : 'Save'}
                  </button>
                  <button className={styles.deleteBtn} onClick={() => deleteRow(row.id)}>✕</button>
                </div>
              </div>
            ))}

            {adding && (
              <div className={`${styles.mobileCard} ${styles.mobileCardNew}`}>
                <div className={styles.mobileCardField}>
                  <label className={styles.mobileCardLabel}>Destination</label>
                  <input
                    className={styles.inputDest}
                    placeholder="e.g. El Gouna"
                    value={newRow.destination}
                    onChange={e => setNewRow(p => ({ ...p, destination: e.target.value }))}
                  />
                </div>
                <div className={styles.mobileCardPriceRow}>
                  <div className={styles.mobileCardField}>
                    <label className={styles.mobileCardLabel}>PKW (€)</label>
                    <input
                      type="number"
                      className={styles.inputPrice}
                      value={newRow.car_price}
                      onChange={e => setNewRow(p => ({ ...p, car_price: Number(e.target.value) }))}
                    />
                  </div>
                  <div className={styles.mobileCardField}>
                    <label className={styles.mobileCardLabel}>Minibus (€)</label>
                    <input
                      type="number"
                      className={styles.inputPrice}
                      value={newRow.minibus_price}
                      onChange={e => setNewRow(p => ({ ...p, minibus_price: Number(e.target.value) }))}
                    />
                  </div>
                  <div className={styles.mobileCardField}>
                    <label className={styles.mobileCardLabel}>Sort</label>
                    <input
                      type="number"
                      className={styles.inputSmall}
                      value={newRow.sort_order}
                      onChange={e => setNewRow(p => ({ ...p, sort_order: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className={styles.mobileCardActions}>
                  <button className={styles.saveBtn} onClick={addRow}>Add</button>
                  <button className={styles.deleteBtn} onClick={() => { setAdding(false); setNewRow({ ...EMPTY_ROW }); }}>✕</button>
                </div>
              </div>
            )}

            {rows.length === 0 && !adding && (
              <div className={styles.empty}>No rows yet. Click "+ Add Row" to add the first destination.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
