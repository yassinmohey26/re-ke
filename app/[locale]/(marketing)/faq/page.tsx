import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import FAQAccordion from './FAQAccordion';
import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: tMeta('faqTitle'),
    description: tMeta('faqDescription'),
  };
}

// TODO: fetch from Supabase

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'faq' });
  const { data: faqs, error: faqError } = await supabase.from('faqs').select('question, answer').eq('locale', locale).order('sort_order');
  let displayFaqs = faqs;
  if (faqError && faqError.message?.includes('locale')) {
    const fallback = await supabase.from('faqs').select('question, answer').order('sort_order');
    displayFaqs = fallback.data;
  }

  return (
    <>
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
