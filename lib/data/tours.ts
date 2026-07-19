import { getSupabaseAdmin } from '@/lib/supabase';
import { translateTour, translateDestination, translateCategory } from './translate';

const db = getSupabaseAdmin();

export interface Tour {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number | null;
  duration: string;
  durationHours: number;
  maxGuests: number;
  difficulty: 'leicht' | 'mittel' | 'schwer';
  minAge: number;
  destination: string;
  destinationSlug: string;
  category: 'ganztag' | 'halbtag' | 'wassersport' | 'wuesten-safari';
  categoryLabel: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  image: string;
  meetingPoint: string;
  featured: boolean;
}

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface TourCategory {
  slug: string;
  label: string;
  category: Tour['category'];
  description: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTour(row: any): Tour {
  return {
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? '',
    description: row.description ?? '',
    price: row.price,
    duration: row.duration ?? '',
    durationHours: row.duration_hours ?? 0,
    maxGuests: row.max_guests ?? 8,
    difficulty: row.difficulty ?? 'leicht',
    minAge: row.min_age ?? 6,
    destination: row.destination ?? '',
    destinationSlug: row.destination_slug ?? '',
    category: row.category ?? 'ganztag',
    categoryLabel: row.category_label ?? '',
    highlights: row.highlights ?? [],
    included: row.included ?? [],
    notIncluded: row.not_included ?? [],
    itinerary: row.itinerary ?? [],
    faqs: row.faqs ?? [],
    image: row.image ?? '',
    meetingPoint: row.meeting_point ?? '',
    featured: row.featured ?? false,
  };
}

function mapDestination(row: any): Destination {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    image: row.image ?? '',
  };
}

function mapCategory(row: any): TourCategory {
  return {
    slug: row.slug,
    label: row.label,
    category: row.category,
    description: row.description ?? '',
  };
}

export async function getTours(): Promise<Tour[]> {
  const { data } = await db.from('tours').select('*').order('created_at', { ascending: false });
  return (data ?? []).map(mapTour);
}

export async function getTourBySlug(slug: string): Promise<Tour | undefined> {
  const { data } = await db.from('tours').select('*').eq('slug', slug).single();
  return data ? mapTour(data) : undefined;
}

export async function getToursByCategory(category: Tour['category']): Promise<Tour[]> {
  const { data } = await db.from('tours').select('*').eq('category', category).order('created_at', { ascending: false });
  return (data ?? []).map(mapTour);
}

export async function getToursByDestination(destinationSlug: string): Promise<Tour[]> {
  const { data } = await db.from('tours').select('*').eq('destination_slug', destinationSlug).order('created_at', { ascending: false });
  return (data ?? []).map(mapTour);
}

export async function getFeaturedTours(): Promise<Tour[]> {
  const { data } = await db.from('tours').select('*').eq('featured', true).order('created_at', { ascending: false });
  return (data ?? []).map(mapTour);
}

export async function getDestinations(): Promise<Destination[]> {
  const { data } = await db.from('destinations').select('*').order('created_at', { ascending: true });
  return (data ?? []).map(mapDestination);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  const { data } = await db.from('destinations').select('*').eq('slug', slug).single();
  return data ? mapDestination(data) : undefined;
}

export async function getTourCategories(): Promise<TourCategory[]> {
  const { data } = await db.from('tour_categories').select('*').order('created_at', { ascending: true });
  return (data ?? []).map(mapCategory);
}

export async function getLocalizedTourName(slug: string, locale: string): Promise<string> {
  const tour = await getTourBySlug(slug);
  if (!tour) return slug;
  if (locale === 'de') return tour.name;
  const tr = await translateTour(tour, locale);
  return tr.name;
}

export async function getLocalizedTourShortDescription(slug: string, locale: string): Promise<string> {
  const tour = await getTourBySlug(slug);
  if (!tour) return '';
  if (locale === 'de') return tour.shortDescription;
  const tr = await translateTour(tour, locale);
  return tr.shortDescription;
}

export async function getLocalizedDestinationData(
  dest: Destination,
  locale: string,
): Promise<{ tagline: string; description: string; name: string }> {
  if (locale === 'de') return { tagline: dest.tagline, description: dest.description, name: dest.name };
  return translateDestination(dest, locale);
}

export async function getLocalizedCategoryLabel(slug: string, locale: string): Promise<string> {
  const cats = await getTourCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return slug;
  if (locale === 'de') return cat.label;
  const tr = await translateCategory(cat, locale);
  return tr.label;
}

export async function getLocalizedTour(slug: string, locale: string): Promise<Tour | undefined> {
  const tour = await getTourBySlug(slug);
  if (!tour) return undefined;
  if (locale === 'de') return tour;

  const tr = await translateTour(tour, locale);
  return {
    ...tour,
    name: tr.name,
    shortDescription: tr.shortDescription,
    description: tr.description,
    categoryLabel: tr.categoryLabel,
    highlights: tr.highlights,
    included: tr.included,
    notIncluded: tr.notIncluded,
    itinerary: tr.itinerary,
    faqs: tr.faqs,
    meetingPoint: tr.meetingPoint,
    duration: tr.duration,
  };
}

export async function getLocalizedAllTours(locale: string): Promise<Tour[]> {
  const tours = await getTours();
  if (locale === 'de') return tours;

  const translated: Tour[] = [];
  for (const tour of tours) {
    const tr = await translateTour(tour, locale);
    translated.push({
      ...tour,
      name: tr.name,
      shortDescription: tr.shortDescription,
      description: tr.description,
      categoryLabel: tr.categoryLabel,
      highlights: tr.highlights,
      included: tr.included,
      notIncluded: tr.notIncluded,
      itinerary: tr.itinerary,
      faqs: tr.faqs,
      meetingPoint: tr.meetingPoint,
      duration: tr.duration,
    });
  }
  return translated;
}
