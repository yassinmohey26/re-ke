import { getSupabaseAdmin } from '@/lib/supabase';
import { getLocalizedAllTours } from '@/lib/data/tours';
import {
  resolveReviewTranslation,
  type ReviewTranslation,
  type ReviewTranslations,
} from '@/lib/reviews';

const db = getSupabaseAdmin();

export interface TourReview {
  id: string;
  tourId: string;
  guestName: string;
  guestCountry: string;
  countryCode: string;
  guestImage: string;
  travelDate: string | null;
  rating: number;
  title: string;
  body: string;
  translations: ReviewTranslations;
  isVerified: boolean;
  isPublished: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  tour?: {
    slug: string;
    name: string;
    image: string;
  };
}

export interface ReviewSummary {
  average: number;
  total: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

function mapReview(
  row: Record<string, unknown>,
  translation: ReviewTranslation,
): TourReview {
  return {
    id: String(row.id),
    tourId: String(row.tour_id),
    guestName: String(row.guest_name ?? ''),
    guestCountry: String(row.guest_country ?? ''),
    countryCode: String(row.country_code ?? ''),
    guestImage: String(row.guest_image ?? ''),
    travelDate: typeof row.travel_date === 'string' ? row.travel_date : null,
    rating: Number(row.rating),
    title: translation.title,
    body: translation.body,
    translations: (row.translations ?? {}) as ReviewTranslations,
    isVerified: row.is_verified === true,
    isPublished: row.is_published === true,
    featured: row.featured === true,
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: String(row.created_at ?? ''),
  };
}

export function summarizeReviews(reviews: TourReview[]): ReviewSummary {
  const breakdown: ReviewSummary['breakdown'] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let ratingTotal = 0;

  for (const review of reviews) {
    const rating = review.rating as 1 | 2 | 3 | 4 | 5;
    breakdown[rating] += 1;
    ratingTotal += rating;
  }

  return {
    average: reviews.length
      ? Math.round((ratingTotal / reviews.length) * 10) / 10
      : 0,
    total: reviews.length,
    breakdown,
  };
}

export async function getTourReviews(
  tourId: string,
  locale: string,
): Promise<TourReview[]> {
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('tour_id', tourId)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('travel_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[reviews] Failed to load tour reviews:', error.message);
    return [];
  }

  return (data ?? []).flatMap(row => {
    const translation = resolveReviewTranslation(row.translations, locale);
    return translation
      ? [mapReview(row as Record<string, unknown>, translation)]
      : [];
  });
}

export async function getFeaturedReviews(
  locale: string,
  limit = 4,
): Promise<TourReview[]> {
  const [{ data, error }, tours] = await Promise.all([
    db
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .order('travel_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit),
    getLocalizedAllTours(locale),
  ]);

  if (error) {
    console.error('[reviews] Failed to load featured reviews:', error.message);
    return [];
  }

  const toursById = new Map(tours.map(tour => [tour.id, tour]));

  return (data ?? []).flatMap(row => {
    const translation = resolveReviewTranslation(row.translations, locale);
    const tour = toursById.get(row.tour_id);

    if (!translation || !tour) return [];

    return [{
      ...mapReview(row as Record<string, unknown>, translation),
      tour: {
        slug: tour.slug,
        name: tour.name,
        image: tour.image,
      },
    }];
  });
}
