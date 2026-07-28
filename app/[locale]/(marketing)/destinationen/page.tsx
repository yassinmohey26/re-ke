import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import { getDestinations } from '@/lib/data/tours';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMeta('destinationsTitle');
  const description = tMeta('destinationsDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/destinationen`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${baseUrl}/og-default.jpg`] },
    alternates: {
      canonical: `${baseUrl}/${locale}/destinationen`,
      languages: {
        'de': `${baseUrl}/de/destinationen`,
        'en': `${baseUrl}/en/destinationen`,
        'ru': `${baseUrl}/ru/destinationen`,
        'ar': `${baseUrl}/ar/destinationen`,
        'fr': `${baseUrl}/fr/destinationen`,
        'hu': `${baseUrl}/hu/destinationen`,
        'x-default': `${baseUrl}/de/destinationen`,
      },
    },
  };
}

export default async function DestinationenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'destinations' });
  const destinations = await getDestinations(locale);

  return (
    <>
      <PageHeader
        eyebrow={t('pageEyebrow')}
        title={t('pageTitleFull')}
        description={t('pageDesc')}
      />
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {destinations.length === 0 ? (
              <p>{t('noDestinations')}</p>
            ) : destinations.map((dest) => (
              <Link key={dest.slug} href={`/destinationen/${dest.slug}`} className={styles.card}>
                <div className={styles.imgWrap}>
                  {dest.image ? (
                    <Image src={dest.image} alt={dest.name} fill className={styles.img} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  ) : (
                    <div className={styles.img} style={{ background: 'var(--color-text-1)' }} />
                  )}
                  <div className={styles.overlay} />
                </div>
                <div className={styles.content}>
                  <h2 className={styles.name}>{dest.name}</h2>
                  <p className={styles.tagline}>{dest.tagline}</p>
                  <p className={styles.desc}>{dest.description}</p>
                  <span className={styles.link}>
                    {t('discover')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
