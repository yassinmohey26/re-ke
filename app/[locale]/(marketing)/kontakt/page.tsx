import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ContactForm from '@/components/forms/ContactForm';
import JsonLd from '@/components/seo/JsonLd';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations('metadata');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMeta('contactTitle');
  const description = tMeta('contactDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/kontakt`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-default.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/kontakt`,
      languages: {
        'de': `${baseUrl}/de/kontakt`,
        'en': `${baseUrl}/en/kontakt`,
        'ru': `${baseUrl}/ru/kontakt`,
        'ar': `${baseUrl}/ar/kontakt`,
        'fr': `${baseUrl}/fr/kontakt`,
        'hu': `${baseUrl}/hu/kontakt`,
      },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const CONTACT_INFO = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: t('email'),
      value: 'info@hurghada-reiseplaner.at',
      href: 'mailto:info@hurghada-reiseplaner.at',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2a10 10 0 0 0-8.527 15.256L2 22l4.744-1.473A10 10 0 1 0 12 2z"/>
        </svg>
      ),
      label: t('whatsapp'),
      value: '+43 681 811 400 99',
      href: 'https://wa.me/4368181140099',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      label: t('responseTimeLabel'),
      value: t('responseTimeValue'),
      href: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: t('locationLabel'),
      value: t('locationValue'),
      href: null,
    },
  ];

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name: 'Hurghada Reiseplaner',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at',
        telephone: '+43 681 811 400 99',
        email: 'info@hurghada-reiseplaner.at',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hurghada',
          addressRegion: 'Red Sea',
          addressCountry: 'EG',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 27.2579,
          longitude: 33.8116,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '21:00',
        },
      }} />
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <span className="section-eyebrow">{t('pageHeaderEyebrow')}</span>
          <h1 className={styles.pageTitle}>{t('pageTitle')}</h1>
          <p className={styles.pageDesc}>{t('pageDescription')}</p>
        </div>
      </div>

      {/* Main content */}
      <section className={`section ${styles.main}`}>
        <div className="container">
          <div className={styles.grid}>
            {/* Left: contact info + form */}
            <div className={styles.formSide}>
              <h2 className={styles.formTitle}>{t('writeUs')}</h2>
              <ContactForm />
            </div>

            {/* Right: sidebar info */}
            <aside className={styles.sidebar}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>{t('infoTitle')}</h3>
                <div className={styles.infoList}>
                  {CONTACT_INFO.map((item) => (
                    <div key={item.label} className={styles.infoItem}>
                      <div className={styles.infoIcon}>{item.icon}</div>
                      <div>
                        <span className={styles.infoLabel}>{item.label}</span>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className={styles.infoValue}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className={styles.infoValue}>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why contact us box */}
              <div className={styles.whyBox}>
                <h3 className={styles.whyTitle}>{t('whyTitle')}</h3>
                <ul className={styles.whyList}>
                  {[t('why1'), t('why2'), t('why3'), t('why4'), t('why5')].map((item) => (
                    <li key={item} className={styles.whyItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
