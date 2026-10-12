export const EXTRA_LOCALES = ['de', 'en', 'fr', 'hu', 'ru', 'ar'] as const;
export type ExtraLocale = typeof EXTRA_LOCALES[number];

export interface ExtraText {
  name: string;
  description: string;
}

export function isExtraLocale(value: unknown): value is ExtraLocale {
  return typeof value === 'string' && EXTRA_LOCALES.includes(value as ExtraLocale);
}

/** Legacy plain descriptions belong to the German base extra. */
export function parseExtraTexts(baseName: string, rawDescription: string | null): Partial<Record<ExtraLocale, ExtraText>> {
  const raw = rawDescription ?? '';
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const texts: Partial<Record<ExtraLocale, ExtraText>> = {};
      for (const locale of EXTRA_LOCALES) {
        const value = (parsed as Record<string, unknown>)[locale];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          const entry = value as Record<string, unknown>;
          if (typeof entry.name === 'string' && entry.name.trim()) {
            texts[locale] = {
              name: entry.name,
              description: typeof entry.description === 'string' ? entry.description : '',
            };
          }
        }
      }
      if (Object.keys(texts).length > 0) {
        texts.de ??= { name: baseName, description: '' };
        return texts;
      }
    }
  } catch {
    // Plain-text legacy description.
  }
  return { de: { name: baseName, description: raw } };
}

export function getExtraText(
  row: { name: string; description: string | null },
  locale: ExtraLocale,
): ExtraText | null {
  const texts = parseExtraTexts(row.name, row.description);
  if (locale === 'de') {
    return row.name.trim() ? { name: row.name, description: texts.de?.description ?? '' } : null;
  }
  const text = texts[locale];
  return text?.name.trim() ? text : null;
}

export function updateExtraTexts(
  row: { name: string; description: string | null },
  locale: ExtraLocale,
  text: ExtraText,
): string {
  return JSON.stringify({
    ...parseExtraTexts(row.name, row.description),
    [locale]: { name: text.name.trim(), description: text.description.trim() },
  });
}
