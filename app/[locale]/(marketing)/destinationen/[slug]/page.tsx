import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ToursClient from '@/app/[locale]/(marketing)/touren/ToursClient';
import { getDestinationBySlug, getLocalizedAllTours } from '@/lib/data/tours';
import JsonLd from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  setRequestLocale(locale);
  const dest = await getDestinationBySlug(slug, locale);
  if (!dest) return { title: (await getTranslations({ locale, namespace: 'common' }))('noResults') };
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const title = `${dest.name} – ${tMeta('toursTitle')}`;
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  const ogImage = dest.image || `${baseUrl}/og-default.jpg`;
  return {
    title,
    description: dest.tagline,
    openGraph: {
      title,
      description: dest.tagline,
      url: `${baseUrl}/${locale}/destinationen/${slug}`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: ogImage, width: 1200, height: 630, alt: dest.name }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: dest.tagline,
      images: [ogImage],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/destinationen/${slug}`,
      languages: {
        'de': `${baseUrl}/de/destinationen/${slug}`,
        'en': `${baseUrl}/en/destinationen/${slug}`,
        'ru': `${baseUrl}/ru/destinationen/${slug}`,
        'ar': `${baseUrl}/ar/destinationen/${slug}`,
        'fr': `${baseUrl}/fr/destinationen/${slug}`,
        'hu': `${baseUrl}/hu/destinationen/${slug}`,
        'x-default': `${baseUrl}/de/destinationen/${slug}`,
      },
    },
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const dest = await getDestinationBySlug(slug, locale);
  if (!dest) notFound();

  const allTours = await getLocalizedAllTours(locale);
  const tours = allTours.filter((t) => t.destinationSlug === slug);
  const t = await getTranslations('tours');

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
    filterActivities: await t('filterActivities'),
    filterDuration: await t('filterDuration'),
    filterTimeOfDay: await t('filterTimeOfDay'),
    filterLanguages: await t('filterLanguages'),
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
    activityFamily: await t('activityFamily'),
    activityWellness: await t('activityWellness'),
    activityLuxury: await t('activityLuxury'),
    activityWater: await t('activityWater'),
    activitySnorkeling: await t('activitySnorkeling'),
    timeMorning: await t('timeMorning'),
    timeAfternoon: await t('timeAfternoon'),
    timeEvening: await t('timeEvening'),
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
    favorite: await (await getTranslations('a11y'))('favorite'),
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${locale}` },
          { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${baseUrl}/${locale}/destinationen` },
          { '@type': 'ListItem', position: 3, name: dest.name },
        ],
      }} />
      <Suspense>
        <ToursClient
          tours={tours}
          locale={locale}
          heroTitle={dest.name}
          heroImage={dest.image || undefined}
          translations={translations}
        />
      </Suspense>
    </>
  );
}
