'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQManagerProps {
  faqs: FAQItem[];
  onChange: (faqs: FAQItem[]) => void;
  styles: { [key: string]: string };
}

const emptyItem: FAQItem = { question: '', answer: '' };

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

export default function FAQManager({ faqs, onChange, styles }: FAQManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<FAQItem>(emptyItem);

  function startAdd() {
    setForm(emptyItem);
    setEditingIndex('new');
  }

  function startEdit(index: number) {
    setForm({ ...faqs[index] });
    setEditingIndex(index);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setForm(emptyItem);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (index < 0 || target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    if (!confirm('Delete this FAQ?')) return;
    onChange(faqs.filter((_, i) => i !== index));
    if (editingIndex === index) cancelEdit();
  }

  function commitEdit() {
    if (!form.question.trim() && !form.answer.trim()) {
      cancelEdit();
      return;
    }
    const item = { question: form.question.trim(), answer: form.answer.trim() };
    if (editingIndex === 'new') {
      onChange([...faqs, item]);
    } else if (editingIndex !== null) {
      onChange(faqs.map((it, i) => (i === editingIndex ? item : it)));
    }
    cancelEdit();
  }

  return (
    <details className={`${styles.section} ${styles.collapsibleSection}`}>
      <summary className={styles.sectionSummary}>
        <span>FAQs (Deutsch – master)</span>
        <span className={styles.sectionChevron} aria-hidden="true">⌄</span>
      </summary>
      <div className={styles.collapsibleContent}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-3)', marginBottom: 'var(--space-3)' }}>
        German FAQs are the single source of truth. Saved directly to the tours table.
      </p>

      <table className={styles.managerTable} style={{ width: '100%', marginBottom: 'var(--space-3)', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>#</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Question</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Answer</th>
            <th style={{ padding: '8px' }} />
          </tr>
        </thead>
        <tbody>
          {faqs.map((item, index) => (
            <tr key={index} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <td data-label="Order" style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} style={reorderBtnStyle}>▲</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === faqs.length - 1} style={reorderBtnStyle}>▼</button>
                </div>
              </td>
              <td data-label="Question" style={{ padding: '8px' }}>{item.question || <span style={{ opacity: 0.6 }}>—</span>}</td>
              <td data-label="Answer" style={{ padding: '8px', opacity: 0.8 }}>{item.answer}</td>
              <td data-label="Actions" style={{ padding: '8px', display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => startEdit(index)} className={styles.slugBtn}>Edit</button>
                <button type="button" onClick={() => remove(index)} className={styles.cancelBtn}>Delete</button>
              </td>
            </tr>
          ))}
          {faqs.length === 0 && (
            <tr><td colSpan={4} style={{ padding: '8px', opacity: 0.7 }}>No FAQs yet.</td></tr>
          )}
        </tbody>
      </table>

      {editingIndex !== null ? (
        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label}>Question</label>
            <input className={styles.input} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
          </div>
          <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Answer</label>
            <textarea className={styles.textarea} rows={3} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
            <button type="button" onClick={commitEdit} className={styles.saveBtn}>
              {editingIndex === 'new' ? 'Add FAQ' : 'Update FAQ'}
            </button>
            <button type="button" onClick={cancelEdit} className={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={startAdd} className={styles.slugBtn}>+ Add FAQ</button>
      )}

      <p style={{ marginTop: 'var(--space-3)', fontSize: '12px', color: 'var(--color-text-3)' }}>
        {faqs.length} FAQ(s)
      </p>
      </div>
    </details>
  );
}
