export const locales = ['de', 'en', 'ru', 'ar', 'fr', 'hu'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export const RTL_LOCALES: Locale[] = ['ar'];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}
