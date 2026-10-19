export const REVIEW_LOCALES = ['de', 'en', 'fr', 'hu', 'ru', 'ar'] as const;

export type ReviewLocale = typeof REVIEW_LOCALES[number];
export const REVIEW_TYPES = ['company', 'tour', 'transfer'] as const;
export type ReviewType = typeof REVIEW_TYPES[number];

export function reviewType(value: unknown): ReviewType {
  return value === 'company' || value === 'transfer' ? value : 'tour';
}

export function reviewTourIds(row: Record<string, unknown>): string[] {
  if (reviewType(row.review_type) !== 'tour') return [];
  const links = Array.isArray(row.review_tours) ? row.review_tours : [];
  return [...new Set([
    ...(typeof row.tour_id === 'string' ? [row.tour_id] : []),
    ...links.flatMap(link => isObject(link) && typeof link.tour_id === 'string'
      ? [link.tour_id] : []),
  ])];
}

export interface ReviewTranslation {
  title: string;
  body: string;
}

export type ReviewTranslations = Partial<
  Record<ReviewLocale, ReviewTranslation>
>;

export interface ReviewMutationRow {
  tour_id: string | null;
  review_type: ReviewType;
  guest_name: string;
  guest_country: string;
  country_code: string;
  guest_image: string;
  travel_date: string | null;
  rating: number;
  translations: ReviewTranslations;
  is_verified: boolean;
  is_published: boolean;
  featured: boolean;
  sort_order: number;
  updated_at: string;
}

export type ReviewInputResult =
  | { row: ReviewMutationRow; tourIds: string[]; error?: never }
  | { row?: never; error: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function sanitizeReviewTranslations(value: unknown): ReviewTranslations {
  if (!isObject(value)) return {};

  const translations: ReviewTranslations = {};

  for (const locale of REVIEW_LOCALES) {
    const candidate = value[locale];
    if (!isObject(candidate)) continue;

    const title = readString(candidate.title);
    const body = readString(candidate.body);

    if (title || body) {
      translations[locale] = { title, body };
    }
  }

  return translations;
}

export function resolveReviewTranslation(
  value: unknown,
  locale: string,
): ReviewTranslation | null {
  const translations = sanitizeReviewTranslations(value);
  const requestedLocale = REVIEW_LOCALES.includes(locale as ReviewLocale)
    ? locale as ReviewLocale
    : 'de';

  const fallbackOrder: ReviewLocale[] = [
    requestedLocale,
    'de',
    'en',
    ...REVIEW_LOCALES.filter(
      candidate =>
        candidate !== requestedLocale &&
        candidate !== 'de' &&
        candidate !== 'en',
    ),
  ];

  for (const candidate of fallbackOrder) {
    const translation = translations[candidate];
    if (translation?.body) return translation;
  }

  return null;
}

export function sanitizeReviewInput(value: unknown): ReviewInputResult {
  if (!isObject(value)) {
    return { error: 'Invalid review payload' };
  }

  const type = value.reviewType ?? 'tour';
  if (!REVIEW_TYPES.includes(type as ReviewType)) {
    return { error: 'Invalid review type' };
  }
  const requestedTours = value.tourIds ?? (value.tourId ? [value.tourId] : []);
  if (!Array.isArray(requestedTours) || requestedTours.some(id =>
    typeof id !== 'string' || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id),
  )) return { error: 'Invalid tour selection' };
  const tourIds = type === 'tour' ? [...new Set<string>(requestedTours)] : [];
  const guestName = readString(value.guestName);
  const guestCountry = readString(value.guestCountry);
  const countryCode = readString(value.countryCode).toUpperCase();
  const guestImage = readString(value.guestImage);
  const travelDate = readString(value.travelDate);
  const rating = Number(value.rating);
  const sortOrder = Number(value.sortOrder ?? 0);
  const translations = sanitizeReviewTranslations(value.translations);

  if (type === 'tour' && tourIds.length === 0) return { error: 'At least one tour is required' };
  if (!guestName) return { error: 'Guest name is required' };

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'Rating must be an integer between 1 and 5' };
  }

  if (countryCode && !/^[A-Z]{2}$/.test(countryCode)) {
    return { error: 'Country code must contain two letters' };
  }

  if (travelDate && !/^\d{4}-\d{2}-\d{2}$/.test(travelDate)) {
    return { error: 'Travel date must use YYYY-MM-DD format' };
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    return { error: 'Sort order must be a non-negative integer' };
  }

  if (!Object.values(translations).some(translation => translation?.body)) {
    return { error: 'Review text is required in at least one language' };
  }

  return {
    tourIds,
    row: {
      tour_id: tourIds[0] ?? null,
      review_type: type as ReviewType,
      guest_name: guestName,
      guest_country: guestCountry,
      country_code: countryCode,
      guest_image: guestImage,
      travel_date: travelDate || null,
      rating,
      translations,
      is_verified: value.isVerified === true,
      is_published: value.isPublished === true,
      featured: value.featured === true,
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    },
  };
}
