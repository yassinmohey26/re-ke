export const REVIEW_LOCALES = ['de', 'en', 'fr', 'hu', 'ru', 'ar'] as const;

export type ReviewLocale = typeof REVIEW_LOCALES[number];

export interface ReviewTranslation {
  title: string;
  body: string;
}

export type ReviewTranslations = Partial<
  Record<ReviewLocale, ReviewTranslation>
>;

export interface ReviewMutationRow {
  tour_id: string;
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
  | { row: ReviewMutationRow; error?: never }
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

  const tourId = readString(value.tourId);
  const guestName = readString(value.guestName);
  const guestCountry = readString(value.guestCountry);
  const countryCode = readString(value.countryCode).toUpperCase();
  const guestImage = readString(value.guestImage);
  const travelDate = readString(value.travelDate);
  const rating = Number(value.rating);
  const sortOrder = Number(value.sortOrder ?? 0);
  const translations = sanitizeReviewTranslations(value.translations);

  if (!tourId) return { error: 'A tour is required' };
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
    row: {
      tour_id: tourId,
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
