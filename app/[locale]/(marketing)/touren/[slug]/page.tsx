import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TourCard from '@/components/cards/TourCard';
import { getLocalizedTour, getToursByCategory, getLocalizedCategoryLabel, getLocalizedAllTours, getTourExtras } from '@/lib/data/tours';
import { parsePricingTiers, hasPricingTable, stripPricingTable } from '@/lib/pricing-table';
import InteractivePricingTable from '@/components/tours/InteractivePricingTable';
import { TourBookingProvider } from '@/components/tours/TourBookingContext';
import TourGallery from '@/components/tours/TourGallery';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import TourBreadcrumb from '@/components/tours/TourBreadcrumb';
import TourPriceTable from '@/components/tours/TourPriceTable';
import TourDiscountTable from '@/components/tours/TourDiscountTable';
import CancellationPolicy from '@/components/tours/CancellationPolicy';
import TrustBox from '@/components/tours/TrustBox';
import CollapsibleDescription from '@/components/tours/CollapsibleDescription';
import JsonLd from '@/components/seo/JsonLd';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const tour = await getLocalizedTour(slug, locale);
  if (!tour) return { title: (await getTranslations({ locale, namespace: 'common' }))('tourNotFound') };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const tourUrl = `${baseUrl}/${locale}/touren/${slug}`;
  const ogImage = tour.image || `${baseUrl}/og-default.jpg`;

  return {
    title: tour.name,
    description: tour.shortDescription,
    openGraph: {
      title: tour.name,
      description: tour.shortDescription,
      url: tourUrl,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: ogImage, width: 1200, height: 630, alt: tour.name }],
      locale: locale === 'de' ? 'de_AT' : locale === 'ru' ? 'ru_RU' : locale === 'ar' ? 'ar_EG' : locale === 'fr' ? 'fr_FR' : locale === 'hu' ? 'hu_HU' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tour.name,
      description: tour.shortDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: tourUrl,
      languages: {
        'de': `${baseUrl}/de/touren/${slug}`,
        'en': `${baseUrl}/en/touren/${slug}`,
        'ru': `${baseUrl}/ru/touren/${slug}`,
        'ar': `${baseUrl}/ar/touren/${slug}`,
        'fr': `${baseUrl}/fr/touren/${slug}`,
        'hu': `${baseUrl}/hu/touren/${slug}`,
        'x-default': `${baseUrl}/de/touren/${slug}`,
      },
    },
  };
}

export function generateStaticParams() { return []; }
export const dynamicParams = true;

export default async function TourDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const tour = await getLocalizedTour(slug, locale);
  if (!tour) notFound();

  const t = await getTranslations('tours');

  const [relatedToursRaw, catLabel, extras] = await Promise.all([
    getToursByCategory(tour.category, locale).then((list) => list.filter((t) => t.slug !== tour.slug).slice(0, 3)),
    getLocalizedCategoryLabel(tour.category, locale),
    getTourExtras(tour.id, locale),
  ]);

  const relatedTours = relatedToursRaw;

  const galleryImages = tour.images.length > 0 ? tour.images : (tour.image ? [tour.image] : []);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.name,
    description: tour.shortDescription,
    url: `${baseUrl}/${locale}/touren/${slug}`,
    image: tour.image || `${baseUrl}/og-default.jpg`,
    touristType: t('touristType'),
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: tour.duration,
    },
    offers: {
      '@type': 'Offer',
      price: tour.price ?? undefined,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/${locale}/touren/${slug}`,
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Hurghada Reiseplaner',
      url: baseUrl,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: catLabel, item: `${baseUrl}/${locale}/touren/${tour.category}` },
      { '@type': 'ListItem', position: 3, name: tour.name },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: 'var(--space-4)' }}>
        <TourBreadcrumb name={tour.name} />
      </div>

      <section className="section" style={{ paddingTop: 'var(--space-4)' }}>
        <div className="container">
          <TourBookingProvider slug={tour.slug} price={tour.price} maxGuests={Math.min(tour.maxGuests, 8)} pricingTiers={parsePricingTiers(tour.description)} discount={tour.discount} extras={extras}>
            {/* Title */}
            <h1 className={styles.tourTitle}>{tour.name}</h1>
            {tour.meetingPoint && (
              <p className={styles.tourLocation}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                Hurghada
              </p>
            )}

            <div className={styles.layout}>
              {/* === Main Content === */}
              <div className={styles.main}>

                {/* Gallery */}
                {galleryImages.length > 0 && (
                  <TourGallery images={galleryImages} name={tour.name} />
                )}

                {/* Quick Facts */}
                <div className={styles.quickFacts}>
                  <div className={styles.quickFact}>
                    <div className={styles.quickFactIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <span className={styles.quickFactLabel}>{t('duration')}</span>
                      <span className={styles.quickFactValue}>{tour.duration}</span>
                    </div>
                  </div>
                  <div className={styles.quickFact}>
                    <div className={styles.quickFactIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <span className={styles.quickFactLabel}>{t('maxGroupSize')}</span>
                      <span className={styles.quickFactValue}>{tour.maxGuests} {t('persons')}</span>
                    </div>
                  </div>
                  <div className={styles.quickFact}>
                    <div className={styles.quickFactIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <div>
                      <span className={styles.quickFactLabel}>{t('tourType')}</span>
                      <span className={styles.quickFactValue}>{catLabel}</span>
                    </div>
                  </div>
                  <div className={styles.quickFact}>
                    <div className={styles.quickFactIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <span className={styles.quickFactLabel}>{t('meetingPoint')}</span>
                      <span className={styles.quickFactValue}>{tour.meetingPoint}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {tour.description && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('overview')}</h2>
                    <CollapsibleDescription
                      html={hasPricingTable(tour.description) ? stripPricingTable(tour.description) : tour.description}
                    />
                  </div>
                )}

                {/* Interactive Pricing Table (linked to booking context) */}
                {hasPricingTable(tour.description) && (
                  <InteractivePricingTable />
                )}

                {/* Price Table */}
                <TourPriceTable
                  price={tour.price}
                  duration={tour.duration}
                  meetingPoint={tour.meetingPoint}
                  category={tour.category}
                  categoryLabel={catLabel}
                  discount={tour.discount}
                />

                {/* Itinerary */}
                {tour.itinerary.length > 0 && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('tourItinerary')}</h2>
                    <div className={styles.itinerary}>
                      {tour.itinerary.map((step, i) => {
                        const prevDay = i > 0 ? tour.itinerary[i - 1].day : undefined;
                        const showDayHeader = step.day && step.day !== prevDay;
                        return (
                          <div key={i}>
                            {showDayHeader && (
                              <h3 className={styles.itineraryDayHeader}>{step.day}</h3>
                            )}
                            <div className={styles.itineraryStep}>
                              <div className={styles.itineraryNumber}>{i + 1}</div>
                              <div>
                                <h3 className={styles.itineraryTitle}>{step.title}</h3>
                                <p className={styles.itineraryContent}>{step.content}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

                {/* Child Discount */}
                <TourDiscountTable />

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

                {/* Cancellation Policy */}
                <CancellationPolicy />

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

                {/* Trust Box */}
                <TrustBox />
              </div>

              {/* === Sidebar === */}
              <aside className={styles.sidebar}>
                <div className={styles.sidebarSticky}>
                  <TourBookingSidebar styles={styles} />
                </div>
              </aside>
            </div>
          </TourBookingProvider>

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
