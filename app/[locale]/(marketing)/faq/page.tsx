import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import FAQAccordion from './FAQAccordion';
import { supabase } from '@/lib/supabase';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMeta('faqTitle');
  const description = tMeta('faqDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/faq`,
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
      canonical: `${baseUrl}/${locale}/faq`,
      languages: {
        'de': `${baseUrl}/de/faq`,
        'en': `${baseUrl}/en/faq`,
        'ru': `${baseUrl}/ru/faq`,
        'ar': `${baseUrl}/ar/faq`,
        'fr': `${baseUrl}/fr/faq`,
        'hu': `${baseUrl}/hu/faq`,
      },
    },
  };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'faq' });

  const { data: localizedFaqs, error: faqError } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('locale', locale)
    .order('sort_order');

  let displayFaqs = localizedFaqs;

  if (faqError || !displayFaqs || displayFaqs.length === 0) {
    const { data: deFaqs } = await supabase
      .from('faqs')
      .select('question, answer')
      .eq('locale', 'de')
      .order('sort_order');
    displayFaqs = deFaqs;
  }

  if (!displayFaqs || displayFaqs.length === 0) {
    const { data: legacyFaqs } = await supabase
      .from('faqs')
      .select('question, answer')
      .order('sort_order');
    displayFaqs = legacyFaqs;
  }

  return (
    <>
      {displayFaqs && displayFaqs.length > 0 && (
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: displayFaqs.map((faq: { question: string; answer: string }) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }} />
      )}
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: '800px', marginInline: 'auto' }}>
          {displayFaqs && displayFaqs.length > 0 ? (
            <FAQAccordion items={displayFaqs} />
          ) : (
            <p>{t('noFaqs')}</p>
          )}
        </div>
      </section>
    </>
  );
}
