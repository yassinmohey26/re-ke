'use client';

import { useState, useEffect, useCallback } from 'react';

const LOCALES = [
  { code: 'de', label: '🇩🇪 Deutsch', flag: '🇩🇪' },
  { code: 'en', label: '🇬🇧 English', flag: '🇬🇧' },
  { code: 'ru', label: '🇷🇺 Русский', flag: '🇷🇺' },
  { code: 'ar', label: '🇪🇬 العربية', flag: '🇪🇬' },
  { code: 'fr', label: '🇫🇷 Français', flag: '🇫🇷' },
  { code: 'hu', label: '🇭🇺 Magyar', flag: '🇭🇺' },
] as const;

const NAMESPACES = [
  'common', 'nav', 'hero', 'tours', 'destinations', 'blog', 'contact',
  'newsletter', 'footer', 'faq', 'homeFaq', 'booking', 'datenschutz',
  'impressum', 'features', 'homeDest', 'homeBlog', 'homeCta', 'destDetail',
  'metadata', 'airportTransfer', 'homeFeatured', 'a11y', 'whatsapp',
] as const;

interface TranslationRow {
  id?: string;
  locale: string;
  namespace: string;
  key: string;
  value: string;
}

export default function TranslationsClient() {
  const [locale, setLocale] = useState<string>('de');
  const [namespace, setNamespace] = useState<string>('nav');
  const [rows, setRows] = useState<TranslationRow[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const fetchTranslations = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/translations?locale=${locale}&namespace=${namespace}`);
      const data = await res.json();
      setRows(data.rows || []);
      setEdited({});
      setHasChanges(false);
    } catch {
      setMessage('Error loading translations');
    }
    setLoading(false);
  }, [locale, namespace]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  function handleChange(key: string, value: string) {
    setEdited(prev => {
      const next = { ...prev, [key]: value };
      setHasChanges(true);
      return next;
    });
  }

  async function handleSave() {
    if (Object.keys(edited).length === 0) return;
    setSaving(true);
    setMessage('');

    const rows = Object.entries(edited).map(([key, value]) => ({
      locale,
      namespace,
      key,
      value,
    }));

    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Saved ${rows.length} translation(s). Changes live on next page load.`);
        setEdited({});
        setHasChanges(false);
        fetchTranslations();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch {
      setMessage('Error saving translations');
    }
    setSaving(false);
  }

  async function handleSaveAll() {
    const allRows: TranslationRow[] = rows.map(row => ({
      locale,
      namespace,
      key: row.key,
      value: edited[row.key] !== undefined ? edited[row.key] : row.value,
    }));

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: allRows }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Saved all ${allRows.length} translation(s). Changes live on next page load.`);
        setEdited({});
        setHasChanges(false);
        fetchTranslations();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch {
      setMessage('Error saving translations');
    }
    setSaving(false);
  }

  const filtered = rows.filter(row =>
    !search || row.key.toLowerCase().includes(search.toLowerCase()) || row.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-1)' }}>
            🌍 UI Translations
          </h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: 14, marginTop: 4 }}>
            Edit UI strings live. Changes apply on next page load.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {hasChanges && (
            <button
              onClick={handleSaveAll}
              disabled={saving}
              style={{
                padding: '8px 20px',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
                fontSize: 14,
              }}
            >
              {saving ? 'Saving...' : `Save All (${Object.keys(edited).length} changes)`}
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* Locale selector */}
        <div style={{ display: 'flex', gap: 4 }}>
          {LOCALES.map(l => (
            <button
              key={l.code}
              onClick={() => setLocale(l.code)}
              style={{
                padding: '8px 16px',
                border: locale === l.code ? '2px solid #8b5cf6' : '1px solid var(--color-border)',
                borderRadius: 8,
                background: locale === l.code ? '#8b5cf610' : 'var(--color-bg-2)',
                cursor: 'pointer',
                fontWeight: locale === l.code ? 700 : 400,
                color: 'var(--color-text-1)',
                fontSize: 14,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Namespace selector */}
        <select
          value={namespace}
          onChange={e => setNamespace(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            background: 'var(--color-bg-2)',
            color: 'var(--color-text-1)',
            fontSize: 14,
            minWidth: 180,
          }}
        >
          {NAMESPACES.map(ns => (
            <option key={ns} value={ns}>{ns}</option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search keys or values..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            background: 'var(--color-bg-2)',
            color: 'var(--color-text-1)',
            fontSize: 14,
            flex: 1,
            minWidth: 200,
          }}
        />
      </div>

      {/* Status */}
      {message && (
        <div style={{
          padding: '10px 16px',
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 14,
          fontWeight: 500,
          background: message.startsWith('Error') ? '#fef2f2' : '#f0fdf4',
          color: message.startsWith('Error') ? '#dc2626' : '#16a34a',
          border: `1px solid ${message.startsWith('Error') ? '#fecaca' : '#bbf7d0'}`,
        }}>
          {message}
        </div>
      )}

      {/* Translation table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-3)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-3)' }}>
          {rows.length === 0 ? 'No translations found for this locale/namespace.' : 'No matching translations.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(row => {
            const isEdited = row.key in edited;
            const currentValue = isEdited ? edited[row.key] : row.value;

            return (
              <div
                key={row.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: isEdited ? '#8b5cf608' : 'transparent',
                  borderBottom: '1px solid var(--color-border)',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <code style={{
                    fontSize: 13,
                    fontFamily: 'monospace',
                    color: isEdited ? '#8b5cf6' : 'var(--color-text-2)',
                    fontWeight: isEdited ? 600 : 400,
                  }}>
                    {row.key}
                  </code>
                </div>
                <div>
                  <input
                    type="text"
                    value={currentValue}
                    onChange={e => handleChange(row.key, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: isEdited ? '2px solid #8b5cf6' : '1px solid var(--color-border)',
                      borderRadius: 6,
                      background: 'var(--color-bg-2)',
                      color: 'var(--color-text-1)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
