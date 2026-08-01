'use client';

import styles from './LocalePicker.module.css';

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
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>
          Duplicate &amp; Translate
        </h3>
        <p className={styles.hint}>
          Select target language:
        </p>
        <div className={styles.list}>
          {locales.map(loc => (
            <button
              key={loc.code}
              className={styles.option}
              onClick={() => onSelect(loc.code)}
            >
              <span className={styles.flag}>
                {loc.code === 'de' ? '🇩🇪' : loc.code === 'en' ? '🇬🇧' : loc.code === 'ru' ? '🇷🇺' : loc.code === 'ar' ? '🇪🇬' : loc.code === 'fr' ? '🇫🇷' : '🇭🇺'}
              </span>
              {loc.label}
            </button>
          ))}
        </div>
        <button className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
