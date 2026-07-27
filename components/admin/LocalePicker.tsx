'use client';

const LOCALES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'hu', label: 'Magyar' },
];

interface LocalePickerProps {
  exclude?: string;
  onSelect: (locale: string) => void;
  onCancel: () => void;
}

export default function LocalePicker({ exclude, onSelect, onCancel }: LocalePickerProps) {
  const locales = exclude ? LOCALES.filter(l => l.code !== exclude) : LOCALES;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    }} onClick={onCancel}>
      <div
        style={{
          background: '#fff', borderRadius: 12, padding: '24px 28px',
          minWidth: 280, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>
          Duplicate &amp; Translate
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: '#666' }}>
          Select target language:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {locales.map(loc => (
            <button
              key={loc.code}
              onClick={() => onSelect(loc.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: 8,
                background: '#fafafa', cursor: 'pointer', fontSize: 14,
                fontWeight: 500, color: '#333', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0f5ff'; e.currentTarget.style.borderColor = '#155fa7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#e5e5e5'; }}
            >
              <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>
                {loc.code === 'de' ? '🇩🇪' : loc.code === 'en' ? '🇬🇧' : loc.code === 'ru' ? '🇷🇺' : loc.code === 'ar' ? '🇪🇬' : loc.code === 'fr' ? '🇫🇷' : '🇭🇺'}
              </span>
              {loc.label}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          style={{
            marginTop: 12, width: '100%', padding: '8px 0', border: 'none',
            background: 'none', color: '#999', fontSize: 13, cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
