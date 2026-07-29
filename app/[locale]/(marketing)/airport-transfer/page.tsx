import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import HeroSection from '@/components/sections/airport-transfer/HeroSection';
import PricingTable from '@/components/sections/airport-transfer/PricingTable';
import FaqAccordion from '@/components/sections/airport-transfer/FaqAccordion';
import FaqContactCard from '@/components/sections/airport-transfer/FaqContactCard';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMeta('airportTransferTitle');
  const description = tMeta('airportTransferDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/airport-transfer`,
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
      canonical: `${baseUrl}/${locale}/airport-transfer`,
      languages: {
        'de': `${baseUrl}/de/airport-transfer`,
        'en': `${baseUrl}/en/airport-transfer`,
        'ru': `${baseUrl}/ru/airport-transfer`,
        'ar': `${baseUrl}/ar/airport-transfer`,
        'fr': `${baseUrl}/fr/airport-transfer`,
        'hu': `${baseUrl}/hu/airport-transfer`,
        'x-default': `${baseUrl}/de/airport-transfer`,
      },
    },
  };
}

export default async function AirportTransferPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'airportTransfer' });
  const db = getSupabaseAdmin();

  const transfersResult = await db.from('airport_transfers').select('destination, car_price, minibus_price').order('sort_order', { ascending: true });
  const transfers = transfersResult.data ?? [];

  const rawFaqs = t.raw('faqs') as Array<{ q: string; a: string }>;
  const faqs = (rawFaqs ?? []).map((f) => ({ question: f.q, answer: f.a }));

  return (
    <>
      <HeroSection
        image="https://res.cloudinary.com/sx85slkf/image/upload/f_auto,q_auto,w_1920/v1785218112/hurghada-reiseplaner/tours/transfer-hero.avif"
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
      />

      <PricingTable
        heading={t('tableHeading')}
        colGoal={t('colGoal')}
        colCar={t('colCar')}
        colMinibus={t('colMinibus')}
        rows={transfers}
      />

      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqGrid}>
            <FaqAccordion
              heading={t('faqHeading')}
              description={t('faqDescription')}
              items={faqs}
            />
            <FaqContactCard
              heading={t('contactHeading')}
              quote={t('contactQuote')}
              buttonText={t('contactButton')}
            />
          </div>
        </div>
      </section>
    </>
  );
}
