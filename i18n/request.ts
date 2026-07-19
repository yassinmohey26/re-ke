import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {getTranslationsForLocale} from '@/lib/data/translations';

async function buildMessages(locale: string) {
  // Load base JSON as fallback
  const fallback = (await import(`../messages/${locale}.json`)).default;

  // Try to load live translations from Supabase
  try {
    const liveTranslations = await getTranslationsForLocale(locale);

    if (Object.keys(liveTranslations).length > 0) {
      // Merge live translations over the JSON fallback
      for (const [namespace, keys] of Object.entries(liveTranslations)) {
        if (!fallback[namespace]) fallback[namespace] = {};
        for (const [key, value] of Object.entries(keys)) {
          fallback[namespace][key] = value;
        }
      }
    }
  } catch {
    // If Supabase is unreachable, fall back to JSON files
  }

  return fallback;
}

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await buildMessages(locale),
  };
});
