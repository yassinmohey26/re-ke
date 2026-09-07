'use client';

import { useEffect, useMemo, useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import { useAdminLocale } from '../AdminLanguageContext';
import {
  REVIEW_LOCALES,
  type ReviewLocale,
  type ReviewTranslations,
} from '@/lib/reviews';
import styles from './page.module.css';

interface AdminTour {
  id: string;
  name: string;
  slug: string;
}

interface AdminReview {
  id: string;
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
  created_at: string;
  tour: AdminTour | null;
}

interface ReviewForm {
  tourId: string;
  guestName: string;
  guestCountry: string;
  countryCode: string;
  guestImage: string;
  travelDate: string;
  rating: number;
  translations: ReviewTranslations;
  isVerified: boolean;
  isPublished: boolean;
  featured: boolean;
  sortOrder: number;
}

const LOCALE_LABEL_KEYS = {
  de: 'localeDe',
  en: 'localeEn',
  fr: 'localeFr',
  hu: 'localeHu',
  ru: 'localeRu',
  ar: 'localeAr',
} as const;

function emptyTranslations(): ReviewTranslations {
  return Object.fromEntries(
    REVIEW_LOCALES.map(locale => [locale, { title: '', body: '' }]),
  ) as ReviewTranslations;
}

function emptyForm(): ReviewForm {
  return {
    tourId: '',
    guestName: '',
    guestCountry: '',
    countryCode: '',
    guestImage: '',
    travelDate: '',
    rating: 5,
    translations: emptyTranslations(),
    isVerified: false,
    isPublished: false,
    featured: false,
    sortOrder: 1,
  };
}

function getPreviewTranslation(
  translations: ReviewTranslations,
  locale: ReviewLocale,
) {
  return translations[locale]?.body
    ? translations[locale]
    : translations.de?.body
      ? translations.de
      : translations.en?.body
        ? translations.en
        : Object.values(translations).find(translation => translation?.body);
}

function countryFlag(countryCode: string): string {
  if (!/^[A-Z]{2}$/.test(countryCode)) return '';

  return String.fromCodePoint(
    ...countryCode
      .split('')
      .map(character => 127397 + character.charCodeAt(0)),
  );
}

export default function AdminReviewsPage() {
  const {
    locale,
    t,
    confirmDiscardChanges,
    setHasUnsavedChanges,
  } = useAdminLocale();

  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [tours, setTours] = useState<AdminTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<ReviewLocale>('de');
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [tourFilter, setTourFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    void fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    setLoadError('');

    try {
      const response = await fetch('/api/admin/reviews');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load reviews');
      }

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setTours(Array.isArray(data.tours) ? data.tours : []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'Failed to load reviews',
      );
    } finally {
      setLoading(false);
    }
  }

  function openNewReview() {
    const nextPosition = reviews.length
      ? Math.max(...reviews.map(review => review.sort_order), 0) + 1
      : 1;

    setEditingId(null);
    setForm({
      ...emptyForm(),
      sortOrder: nextPosition,
    });
    setActiveLocale('de');
    setFormError('');
    setHasUnsavedChanges(false);
    setShowForm(true);
  }

  function openEditReview(review: AdminReview) {
    const translations = emptyTranslations();

    for (const reviewLocale of REVIEW_LOCALES) {
      translations[reviewLocale] = {
        title: review.translations?.[reviewLocale]?.title ?? '',
        body: review.translations?.[reviewLocale]?.body ?? '',
      };
    }

    setEditingId(review.id);
    setForm({
      tourId: review.tour_id,
      guestName: review.guest_name,
      guestCountry: review.guest_country,
      countryCode: review.country_code,
      guestImage: review.guest_image,
      travelDate: review.travel_date ?? '',
      rating: review.rating,
      translations,
      isVerified: review.is_verified,
      isPublished: review.is_published,
      featured: review.featured,
      sortOrder: review.sort_order,
    });
    setActiveLocale('de');
    setFormError('');
    setHasUnsavedChanges(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    if (!confirmDiscardChanges()) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setFormError('');
    setHasUnsavedChanges(false);
  }

  function updateForm<K extends keyof ReviewForm>(
    key: K,
    value: ReviewForm[K],
  ) {
    setForm(current => ({ ...current, [key]: value }));
    setHasUnsavedChanges(true);
  }

  function updateTranslation(
    key: 'title' | 'body',
    value: string,
  ) {
    setForm(current => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLocale]: {
          title: current.translations[activeLocale]?.title ?? '',
          body: current.translations[activeLocale]?.body ?? '',
          [key]: value,
        },
      },
    }));
    setHasUnsavedChanges(true);
  }

  async function saveReview() {
    setFormError('');

    if (!form.guestName.trim()) {
      setFormError(t('reviewGuestName'));
      return;
    }

    if (!form.tourId) {
      setFormError(t('reviewTour'));
      return;
    }

    const hasReviewText = Object.values(form.translations)
      .some(translation => Boolean(translation?.body.trim()));

    if (!hasReviewText) {
      setFormError(t('reviewBody'));
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        editingId ? `/api/admin/reviews/${editingId}` : '/api/admin/reviews',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save review');
      }

      setHasUnsavedChanges(false);
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm());
      await fetchReviews();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Failed to save review',
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteReview(review: AdminReview) {
    if (!window.confirm(t('reviewDeleteConfirm'))) return;

    const response = await fetch(`/api/admin/reviews/${review.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setReviews(current =>
        current.filter(candidate => candidate.id !== review.id),
      );
    } else {
      const data = await response.json().catch(() => ({}));
      window.alert(data.error || 'Failed to delete review');
    }
  }

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const activeAdminLocale = locale as ReviewLocale;

    return reviews.filter(review => {
      const preview = getPreviewTranslation(
        review.translations,
        activeAdminLocale,
      );

      const matchesSearch = !query || [
        review.guest_name,
        review.guest_country,
        review.tour?.name ?? '',
        preview?.title ?? '',
        preview?.body ?? '',
      ].some(value => value.toLocaleLowerCase().includes(query));

      const matchesTour = !tourFilter || review.tour_id === tourFilter;
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'published' && review.is_published) ||
        (statusFilter === 'draft' && !review.is_published);
      const matchesFeatured = !featuredOnly || review.featured;

      return matchesSearch &&
        matchesTour &&
        matchesStatus &&
        matchesFeatured;
    });
  }, [
    featuredOnly,
    locale,
    reviews,
    search,
    statusFilter,
    tourFilter,
  ]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('reviewsTitle')}</h1>
          <p className={styles.subtitle}>
            {t('reviewsSubtitle')} · {reviews.length}
          </p>
        </div>

        {!showForm && (
          <button className={styles.addButton} onClick={openNewReview}>
            {t('reviewsNew')}
          </button>
        )}
      </div>

      {showForm && (
        <section className={styles.formCard}>
          <div className={styles.formHeader}>
            <div>
              <span className={styles.formEyebrow}>
                {editingId ? t('reviewsEditTitle') : t('reviewsNewTitle')}
              </span>
              <h2 className={styles.formTitle}>
                {form.guestName || t('reviewsNewTitle')}
              </h2>
            </div>

            <div
              className={styles.formRatingPreview}
              aria-label={`${form.rating} / 5`}
            >
              {'★'.repeat(form.rating)}
              <span>{'★'.repeat(5 - form.rating)}</span>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t('reviewGuestName')}</span>
              <input
                value={form.guestName}
                onChange={event =>
                  updateForm('guestName', event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>{t('reviewTour')}</span>
              <select
                value={form.tourId}
                onChange={event => updateForm('tourId', event.target.value)}
              >
                <option value="">{t('reviewsAllTours')}</option>
                {tours.map(tour => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>{t('reviewGuestCountry')}</span>
              <input
                value={form.guestCountry}
                onChange={event =>
                  updateForm('guestCountry', event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>{t('reviewCountryCode')}</span>
              <input
                value={form.countryCode}
                maxLength={2}
                placeholder={t('reviewCountryCodeHint')}
                onChange={event =>
                  updateForm(
                    'countryCode',
                    event.target.value.toUpperCase(),
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>{t('reviewTravelDate')}</span>
              <input
                type="date"
                value={form.travelDate}
                onChange={event =>
                  updateForm('travelDate', event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>{t('reviewSortOrder')}</span>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={event =>
                  updateForm(
                    'sortOrder',
                    Math.max(0, Number(event.target.value)),
                  )
                }
              />
            </label>
          </div>

          <fieldset className={styles.ratingField}>
            <legend>{t('reviewRating')}</legend>
            <div className={styles.ratingButtons}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={rating <= form.rating ? styles.starActive : ''}
                  onClick={() => updateForm('rating', rating)}
                  aria-label={`${rating} / 5`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>

          <div className={styles.imageField}>
            <ImageUpload
              value={form.guestImage}
              onChange={value => updateForm('guestImage', value)}
              folder="hurghada-reiseplaner/reviews"
              label={t('reviewGuestImage')}
            />
          </div>

          <section className={styles.translationCard}>
            <div className={styles.translationHeader}>
              <div>
                <h3>{t('reviewContent')}</h3>
                <p>{t('reviewFallbackHint')}</p>
              </div>
            </div>

            <div
              className={styles.localeTabs}
              role="tablist"
              aria-label={t('reviewContent')}
            >
              {REVIEW_LOCALES.map(reviewLocale => {
                const hasContent = Boolean(
                  form.translations[reviewLocale]?.body.trim(),
                );

                return (
                  <button
                    key={reviewLocale}
                    type="button"
                    role="tab"
                    aria-selected={activeLocale === reviewLocale}
                    className={
                      activeLocale === reviewLocale
                        ? styles.localeTabActive
                        : ''
                    }
                    onClick={() => setActiveLocale(reviewLocale)}
                  >
                    {t(LOCALE_LABEL_KEYS[reviewLocale])}
                    <span
                      className={
                        hasContent
                          ? styles.translationComplete
                          : styles.translationEmpty
                      }
                    />
                  </button>
                );
              })}
            </div>

            <div className={styles.translationFields}>
              <label className={styles.field}>
                <span>{t('reviewTitle')}</span>
                <input
                  value={
                    form.translations[activeLocale]?.title ?? ''
                  }
                  onChange={event =>
                    updateTranslation('title', event.target.value)
                  }
                />
              </label>

              <label className={styles.field}>
                <span>{t('reviewBody')}</span>
                <textarea
                  rows={6}
                  value={form.translations[activeLocale]?.body ?? ''}
                  onChange={event =>
                    updateTranslation('body', event.target.value)
                  }
                />
              </label>
            </div>
          </section>

          <div className={styles.switchGrid}>
            <label className={styles.switchCard}>
              <input
                type="checkbox"
                checked={form.isVerified}
                onChange={event =>
                  updateForm('isVerified', event.target.checked)
                }
              />
              <span>
                <strong>{t('reviewVerified')}</strong>
                <small>✓</small>
              </span>
            </label>

            <label className={styles.switchCard}>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={event =>
                  updateForm('isPublished', event.target.checked)
                }
              />
              <span>
                <strong>{t('reviewPublished')}</strong>
                <small>●</small>
              </span>
            </label>

            <label className={styles.switchCard}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={event =>
                  updateForm('featured', event.target.checked)
                }
              />
              <span>
                <strong>{t('reviewFeatured')}</strong>
                <small>★</small>
              </span>
            </label>
          </div>

          {formError && (
            <p className={styles.errorMessage}>{formError}</p>
          )}

          <div className={styles.formActions}>
            <button
              className={styles.saveButton}
              onClick={saveReview}
              disabled={saving}
            >
              {saving ? t('reviewSaving') : t('reviewSave')}
            </button>

            <button
              className={styles.cancelButton}
              onClick={closeForm}
              disabled={saving}
            >
              {t('reviewCancel')}
            </button>
          </div>
        </section>
      )}

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          value={search}
          placeholder={t('reviewsSearch')}
          onChange={event => setSearch(event.target.value)}
        />

        <select
          className={styles.filterSelect}
          value={tourFilter}
          onChange={event => setTourFilter(event.target.value)}
        >
          <option value="">{t('reviewsAllTours')}</option>
          {tours.map(tour => (
            <option key={tour.id} value={tour.id}>
              {tour.name}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value)}
        >
          <option value="">{t('reviewsAllStatuses')}</option>
          <option value="published">{t('reviewsPublished')}</option>
          <option value="draft">{t('reviewsDraft')}</option>
        </select>

        <label className={styles.featuredFilter}>
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={event => setFeaturedOnly(event.target.checked)}
          />
          {t('reviewsFeaturedOnly')}
        </label>
      </div>

      {loading ? (
        <div className={styles.stateCard}>{t('reviewsLoading')}</div>
      ) : loadError ? (
        <div className={styles.errorCard}>{loadError}</div>
      ) : filteredReviews.length === 0 ? (
        <div className={styles.stateCard}>{t('reviewsNoResults')}</div>
      ) : (
        <div className={styles.reviewGrid}>
          {filteredReviews.map(review => {
            const preview = getPreviewTranslation(
              review.translations,
              locale as ReviewLocale,
            );
            const flag = countryFlag(review.country_code);

            return (
              <article key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  {review.guest_image ? (
                    <img
                      className={styles.avatar}
                      src={review.guest_image}
                      alt=""
                    />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {review.guest_name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className={styles.guestInfo}>
                    <h2>{review.guest_name}</h2>
                    <p>
                      {flag && <span>{flag}</span>}
                      {review.guest_country || review.country_code}
                    </p>
                  </div>

                  <div className={styles.stars}>
                    {'★'.repeat(review.rating)}
                    <span>{'★'.repeat(5 - review.rating)}</span>
                  </div>
                </div>

                <div className={styles.badges}>
                  <span
                    className={
                      review.is_published
                        ? styles.publishedBadge
                        : styles.draftBadge
                    }
                  >
                    {review.is_published
                      ? t('reviewsPublished')
                      : t('reviewsDraft')}
                  </span>

                  {review.is_verified && (
                    <span className={styles.verifiedBadge}>
                      ✓ {t('reviewVerifiedBadge')}
                    </span>
                  )}

                  {review.featured && (
                    <span className={styles.featuredBadge}>
                      ★ {t('reviewFeaturedBadge')}
                    </span>
                  )}
                </div>

                <div className={styles.reviewCopy}>
                  {preview?.title && <h3>{preview.title}</h3>}
                  <p>{preview?.body}</p>
                </div>

                <div className={styles.reviewMeta}>
                  <strong>{review.tour?.name ?? '—'}</strong>
                  {review.travel_date && (
                    <time>
                      {new Intl.DateTimeFormat(locale).format(
                        new Date(`${review.travel_date}T00:00:00`),
                      )}
                    </time>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => openEditReview(review)}
                  >
                    {t('edit')}
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={() => void deleteReview(review)}
                  >
                    {t('delete')}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
