import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { hasLocale } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isRtl } from '@/i18n/config';
import HtmlDirection from '@/components/ui/HtmlDirection';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';

export function generateStaticParams() {
  return [{ locale: 'de' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) return {};
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const localeMap: Record<string, string> = {
    de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU',
  };

  return {
    title: {
      template: `%s | ${t('homeTitle')}`,
      default: t('homeTitle'),
    },
    description: t('homeDescription'),
    openGraph: {
      siteName: t('homeTitle'),
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const rtl = isRtl(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlDirection />
        <div dir={rtl ? 'rtl' : 'ltr'} lang={locale} className={rtl ? 'rtl' : 'ltr'}>
          {children}
        </div>
    </NextIntlClientProvider>
  );
}
