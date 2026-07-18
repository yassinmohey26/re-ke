import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ToursClient from './ToursClient';
import { getLocalizedAllTours, getDestinations } from '@/lib/data/tours';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations('metadata');
  return {
    title: tMeta('toursTitle'),
    description: tMeta('toursDescription'),
  };
}

export default async function TourenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('tours');
  const [tours, destinations] = await Promise.all([getLocalizedAllTours(locale), getDestinations()]);
  const destinationOptions = destinations.map(d => ({ slug: d.slug, name: d.name }));

  const translations = {
    heroTitle: await t('heroTitle'),
    searchWhere: await t('searchWhere'),
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
    favorite: await (await getTranslations('a11y'))('favorite'),
  };

  return <ToursClient tours={tours} locale={locale} destinations={destinationOptions} translations={translations} />;
}
