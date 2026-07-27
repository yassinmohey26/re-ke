import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages: Record<string, any>;

  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    try {
      messages = (await import(`../messages/${routing.defaultLocale}.json`)).default;
    } catch {
      messages = {};
    }
  }

  return {
    locale,
    messages,
  };
});
