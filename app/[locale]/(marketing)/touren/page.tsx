import type { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ToursClient from './ToursClient';
import { getLocalizedAllTours, getDestinations, getDestinationTourIds } from '@/lib/data/tours';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations('metadata');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMeta('toursTitle');
  const description = tMeta('toursDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/touren`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-default.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/touren`,
      languages: {
        'de': `${baseUrl}/de/touren`,
        'en': `${baseUrl}/en/touren`,
        'ru': `${baseUrl}/ru/touren`,
        'ar': `${baseUrl}/ar/touren`,
        'fr': `${baseUrl}/fr/touren`,
        'hu': `${baseUrl}/hu/touren`,
        'x-default': `${baseUrl}/de/touren`,
      },
    },
  };
}

export default async function TourenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('tours');
  const [tours, destinations, destinationTourIds] = await Promise.all([getLocalizedAllTours(locale), getDestinations(locale), getDestinationTourIds()]);
  const removedDestSlugs = new Set(['marsa-alam', 'el-quseir']);
  const destinationOptions = destinations
    .filter(d => !removedDestSlugs.has(d.slug))
    .map(d => ({ slug: d.slug, name: d.name }));

  const heroImage =
    process.env.NEXT_PUBLIC_TOUREN_HERO_IMAGE ||
    'https://res.cloudinary.com/sx85slkf/image/upload/f_auto,q_auto,w_1920/v1785257746/hurghada-reiseplaner/tours/pexels-merna-rakha-589037225-17142737-scaled.jpg';

  const translations = {
    heroTitle: await t('heroTitle'),
    searchWhere: await t('searchWhere'),
    searchWhereLabel: await t('searchWhereLabel'),
    searchWherePlaceholder: await t('searchWherePlaceholder'),
    searchDate: await t('searchDate'),
    searchGuests: await t('searchGuests'),
    searchBtn: await t('searchBtn'),
    filterPrice: await t('filterPrice'),
    filterTypes: await t('filterTypes'),
    filterDuration: await t('filterDuration'),
    clearFilters: await t('clearFilters'),
    sortBy: await t('sortBy'),
    sortByDefault: await t('sortByDefault'),
    sortByPriceAsc: await t('sortByPriceAsc'),
    sortByPriceDesc: await t('sortByPriceDesc'),
    sortByDurationAsc: await t('sortByDurationAsc'),
    sortByDurationDesc: await t('sortByDurationDesc'),
    toursFound: await t('toursFound'),
    showing: await t('showing'),
    of: await t('of'),
    page: await t('page'),
    prev: await t('prev'),
    next: await t('next'),
    typeCultural: await t('typeCultural'),
    typeSnorkel: await t('typeSnorkel'),
    typeSafari: await t('typeSafari'),
    from: await t('from'),
    perPerson: await t('perPerson'),
    hours: await t('hours'),
    persons: await t('persons'),
    allDestinations: await t('allDestinations'),
    inquiry: await t('inquiry'),
    categoryCulturalDesc: await t('categoryCulturalDesc'),
    categorySnorkelDesc: await t('categorySnorkelDesc'),
    categorySafariDesc: await t('categorySafariDesc'),
    viewTours: await t('viewTours'),
    toursWord: await t('toursWord'),
    favorite: await (await getTranslations('a11y'))('favorite'),
  };

  return (
    <Suspense>
      <ToursClient tours={tours} locale={locale} destinations={destinationOptions} destinationTourIds={destinationTourIds} translations={translations} heroImage={heroImage} />
    </Suspense>
  );
}
