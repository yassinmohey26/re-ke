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
  return {
    title: tMeta('airportTransferTitle'),
    description: tMeta('airportTransferDescription'),
    alternates: {
      canonical: `${baseUrl}/${locale}/airport-transfer`,
      languages: {
        'de': `${baseUrl}/de/airport-transfer`,
        'en': `${baseUrl}/en/airport-transfer`,
        'ru': `${baseUrl}/ru/airport-transfer`,
        'ar': `${baseUrl}/ar/airport-transfer`,
        'fr': `${baseUrl}/fr/airport-transfer`,
        'hu': `${baseUrl}/hu/airport-transfer`,
      },
    },
  };
}

export default async function AirportTransferPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'airportTransfer' });
  const db = getSupabaseAdmin();

  const [transfersResult, faqsResult] = await Promise.all([
    db.from('airport_transfers').select('destination, car_price, minibus_price').order('sort_order', { ascending: true }),
    db.from('airport_transfer_faqs').select('question, answer').eq('locale', locale).order('sort_order', { ascending: true }),
  ]);

  const transfers = transfersResult.data ?? [];
  let faqs = faqsResult.data ?? [];
  if (faqsResult.error && faqsResult.error.message?.includes('locale')) {
    const fallback = await db.from('airport_transfer_faqs').select('question, answer').order('sort_order', { ascending: true });
    faqs = fallback.data ?? [];
  }

  return (
    <>
      <HeroSection
        image="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1600&q=80"
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
