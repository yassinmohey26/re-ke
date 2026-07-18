import { supabase, getSupabaseAdmin } from '@/lib/supabase';

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
  if (locale === 'de') {
    const tour = await getTourBySlug(slug);
    return tour?.name ?? slug;
  }
  const { data } = await supabase
    .from('tour_translations')
    .select('name')
    .eq('tour_slug', slug)
    .eq('locale', locale)
    .single();
  return data?.name || (await getTourBySlug(slug))?.name || slug;
}

export async function getLocalizedTourShortDescription(slug: string, locale: string): Promise<string> {
  if (locale === 'de') {
    const tour = await getTourBySlug(slug);
    return tour?.shortDescription ?? '';
  }
  const { data } = await supabase
    .from('tour_translations')
    .select('short_description')
    .eq('tour_slug', slug)
    .eq('locale', locale)
    .single();
  return data?.short_description || (await getTourBySlug(slug))?.shortDescription || '';
}

export async function getLocalizedDestinationData(dest: Destination, locale: string): Promise<{ tagline: string; description: string }> {
  if (locale === 'de') return { tagline: dest.tagline, description: dest.description };
  const { data } = await supabase
    .from('destination_translations')
    .select('tagline, description')
    .eq('destination_slug', dest.slug)
    .eq('locale', locale)
    .single();
  return {
    tagline: data?.tagline ?? dest.tagline,
    description: data?.description ?? dest.description,
  };
}

export async function getLocalizedCategoryLabel(slug: string, locale: string): Promise<string> {
  if (locale === 'de') {
    const cats = await getTourCategories();
    return cats.find((c) => c.slug === slug)?.label ?? slug;
  }
  const { data } = await supabase
    .from('category_translations')
    .select('label')
    .eq('category_slug', slug)
    .eq('locale', locale)
    .single();
  return data?.label || slug;
}

export async function getLocalizedTour(slug: string, locale: string): Promise<Tour | undefined> {
  const tour = await getTourBySlug(slug);
  if (!tour) return undefined;
  if (locale === 'de') return tour;

  const { data } = await supabase
    .from('tour_translations')
    .select('*')
    .eq('tour_slug', slug)
    .eq('locale', locale)
    .single();

  if (!data) return tour;

  return {
    ...tour,
    name: data.name || tour.name,
    shortDescription: data.short_description || tour.shortDescription,
    description: data.description || tour.description,
    categoryLabel: data.category_label || tour.categoryLabel,
    highlights: data.highlights?.length ? data.highlights : tour.highlights,
    included: data.included?.length ? data.included : tour.included,
    notIncluded: data.not_included?.length ? data.not_included : tour.notIncluded,
    itinerary: data.itinerary?.length ? data.itinerary : tour.itinerary,
    faqs: data.faqs?.length ? data.faqs : tour.faqs,
    meetingPoint: data.meeting_point || tour.meetingPoint,
    duration: data.duration || tour.duration,
  };
}

export async function getLocalizedAllTours(locale: string): Promise<Tour[]> {
  const tours = await getTours();
  if (locale === 'de') return tours;

  const slugs = tours.map((t) => t.slug);
  if (slugs.length === 0) return tours;

  const { data: translations } = await supabase
    .from('tour_translations')
    .select('*')
    .eq('locale', locale)
    .in('tour_slug', slugs);

  if (!translations?.length) return tours;

  const transMap = new Map(translations.map((tr) => [tr.tour_slug, tr]));

  return tours.map((tour) => {
    const tr = transMap.get(tour.slug);
    if (!tr) return tour;
    return {
      ...tour,
      name: tr.name || tour.name,
      shortDescription: tr.short_description || tour.shortDescription,
      description: tr.description || tour.description,
      categoryLabel: tr.category_label || tour.categoryLabel,
      highlights: tr.highlights?.length ? tr.highlights : tour.highlights,
      included: tr.included?.length ? tr.included : tour.included,
      notIncluded: tr.not_included?.length ? tr.not_included : tour.notIncluded,
      itinerary: tr.itinerary?.length ? tr.itinerary : tour.itinerary,
      faqs: tr.faqs?.length ? tr.faqs : tour.faqs,
      meetingPoint: tr.meeting_point || tour.meetingPoint,
      duration: tr.duration || tour.duration,
    };
  });
}
