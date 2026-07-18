import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ToursClient from '@/app/[locale]/(marketing)/touren/ToursClient';
import { getDestinationBySlug, getToursByDestination, getLocalizedDestinationData } from '@/lib/data/tours';

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const dest = await getDestinationBySlug(slug);
  if (!dest) return { title: (await getTranslations({ locale, namespace: 'common' }))('noResults') };
  const { tagline } = await getLocalizedDestinationData(dest, locale);
  return { title: `${dest.name} – Touren`, description: tagline };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const dest = await getDestinationBySlug(slug);
  if (!dest) notFound();

  const tours = await getToursByDestination(slug);
  const t = await getTranslations('tours');

  const translations = {
    heroTitle: await t('heroTitle'),
    searchWhere: await t('searchWhere'),
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
    favorite: await (await getTranslations('a11y'))('favorite'),
  };

  return (
    <ToursClient
      tours={tours}
      locale={locale}
      heroTitle={dest.name}
      heroImage={dest.image || undefined}
      translations={translations}
    />
  );
}
