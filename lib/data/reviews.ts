import { getSupabaseAdmin } from '@/lib/supabase';
import { getLocalizedAllTours } from '@/lib/data/tours';
import { loadReviewRows } from './review-rows';
import {
  reviewType,
  reviewTourIds,
  type ReviewType,
  resolveReviewTranslation,
  type ReviewTranslation,
  type ReviewTranslations,
} from '@/lib/reviews';

const db = getSupabaseAdmin();

export interface TourReview {
  id: string;
  reviewType: ReviewType;
  tourIds: string[];
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
  tours: {
    id: string;
    slug: string;
    name: string;
    image: string;
  }[];
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
    reviewType: reviewType(row.review_type),
    tourIds: reviewTourIds(row),
    tours: [],
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
  const data = await loadReviewRows(db, { published: true });
  return data.filter(row => reviewTourIds(row).includes(tourId)).flatMap(row => {
    const translation = resolveReviewTranslation(row.translations, locale);
    return translation
      ? [mapReview(row as Record<string, unknown>, translation)]
      : [];
  });
}

export async function getFeaturedReviews(
  locale: string,
): Promise<TourReview[]> {
  const [data, tours] = await Promise.all([
    loadReviewRows(db, { published: true, featured: true }),
    getLocalizedAllTours(locale),
  ]);

  const toursById = new Map(tours.map(tour => [tour.id, tour]));

  return (data ?? []).flatMap(row => {
    const translation = resolveReviewTranslation(row.translations, locale);
    if (!translation) return [];

    return [{
      ...mapReview(row as Record<string, unknown>, translation),
      tours: reviewTourIds(row).flatMap(id => {
        const tour = toursById.get(id);
        return tour ? [{ id, slug: tour.slug, name: tour.name, image: tour.images[0] ?? '' }] : [];
      }),
    }];
  });
}

export async function getTransferReviews(locale: string): Promise<TourReview[]> {
  const rows = await loadReviewRows(db, { published: true });
  return rows.filter(row => row.review_type === 'transfer').flatMap(row => {
    const translation = resolveReviewTranslation(row.translations, locale);
    return translation ? [mapReview(row, translation)] : [];
  });
}
