import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import TourCard from '@/components/cards/TourCard';
import { getLocalizedTour, getToursByCategory, getLocalizedCategoryLabel, getLocalizedAllTours } from '@/lib/data/tours';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const tour = await getLocalizedTour(slug, locale);
  if (!tour) return { title: (await getTranslations({ locale, namespace: 'common' }))('tourNotFound') };
  return {
    title: tour.name,
    description: tour.shortDescription,
  };
}

export function generateStaticParams() {
  return [];
}

export default async function TourDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const tour = await getLocalizedTour(slug, locale);
  if (!tour) notFound();

  const t = await getTranslations('tours');

  const [relatedToursRaw, catLabel] = await Promise.all([
    getToursByCategory(tour.category).then((list) =>
      list.filter((t) => t.slug !== tour.slug).slice(0, 3)
    ),
    getLocalizedCategoryLabel(tour.category, locale),
  ]);

  const relatedTours = locale !== 'de'
    ? (await getLocalizedAllTours(locale)).filter((t) => t.slug !== tour.slug && t.category === tour.category).slice(0, 3)
    : relatedToursRaw;

  return (
    <>
      <PageHeader
        eyebrow={catLabel}
        title={tour.name}
        description={tour.shortDescription}
        backgroundImage={tour.image}
      />
      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            {/* Main Content */}
            <div className={styles.main}>
              {/* Overview Stats */}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </span>
                  <div>
                    {/* TODO: fetch label from Supabase/i18n */}
                    <span className={styles.statLabel}>{t('duration')}</span>
                    <span className={styles.statValue}>{tour.duration}</span>
                  </div>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </span>
                  <div>
                    <span className={styles.statLabel}>{t('guests')}</span>
                    <span className={styles.statValue}>{tour.maxGuests} {t('persons')}</span>
                  </div>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </span>
                  <div>
                    <span className={styles.statLabel}>{t('difficulty')}</span>
                    <span className={styles.statValue}>{tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}</span>
                  </div>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <div>
                    <span className={styles.statLabel}>{t('meetingPoint')}</span>
                    <span className={styles.statValue}>{tour.meetingPoint}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {tour.description && (
                <div className={styles.section}>
                  {/* TODO: fetch section title from Supabase/i18n */}
                  <h2 className={styles.sectionTitle}>{t('overview')}</h2>
                  <p className={styles.description}>{tour.description}</p>
                </div>
              )}

              {/* Highlights */}
              {tour.highlights.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>{t('highlights')}</h2>
                  <ul className={styles.checkList}>
                    {tour.highlights.map((item) => (
                      <li key={item} className={styles.checkItem}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>{t('tourItinerary')}</h2>
                  <div className={styles.itinerary}>
                    {tour.itinerary.map((step, i) => (
                      <div key={i} className={styles.itineraryStep}>
                        <div className={styles.itineraryNumber}>{i + 1}</div>
                        <div>
                          <h3 className={styles.itineraryTitle}>{step.title}</h3>
                          <p className={styles.itineraryContent}>{step.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Included / Not Included */}
              <div className={styles.includedGrid}>
                {tour.included.length > 0 && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('included')}</h2>
                    <ul className={styles.includedList}>
                      {tour.included.map((item) => (
                        <li key={item} className={styles.includedItem}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-tone-green)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.notIncluded.length > 0 && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('notIncluded')}</h2>
                    <ul className={styles.includedList}>
                      {tour.notIncluded.map((item) => (
                        <li key={item} className={styles.excludedItem}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-tone-red)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* FAQs */}
              {tour.faqs.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>{t('faqs')}</h2>
                  <div className={styles.faqList}>
                    {tour.faqs.map((faq, i) => (
                      <details key={i} className={styles.faqItem}>
                        <summary className={styles.faqQuestion}>{faq.question}</summary>
                        <p className={styles.faqAnswer}>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.bookingCard}>
                <div className={styles.bookingPrice}>
                  {tour.price ? (
                    <>
                       <span className={styles.priceAmount}>{t('from')} {tour.price} EUR</span>
                      <span className={styles.pricePer}>{t('perPerson')}</span>
                    </>
                  ) : (
                    <span className={styles.priceAmount}>{t('requestOnly')}</span>
                  )}
                </div>
                <Link href={`/booking?tour=${tour.slug}`} className="btn btn--primary btn--lg" style={{ width: '100%', textAlign: 'center' }}>
                  {t('bookTour')}
                </Link>
                <p style={{ fontSize: 12, color: 'var(--color-text-5)', textAlign: 'center', marginTop: 'var(--space-2)' }}>
                  {t('noDeposit')}
                </p>
              </div>
            </aside>
          </div>

          {/* Related Tours */}
          {relatedTours.length > 0 && (
            <div className={styles.related}>
              <h2 className="section-title">{t('relatedTours')}</h2>
              <div className={styles.relatedGrid}>
                {relatedTours.map((related) => (
                  <TourCard key={related.slug} tour={related} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
