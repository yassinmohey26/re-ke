import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import Destinations from '@/components/sections/Destinations';
import FeaturedTours from '@/components/sections/FeaturedTours';
import Features from '@/components/sections/Features';
import BlogPreview from '@/components/sections/BlogPreview';
import FAQ from '@/components/sections/FAQ';
import CTA from '@/components/sections/CTA';
import { getDestinations } from '@/lib/data/tours';
import { getLocalizedAllBlogPosts } from '@/lib/data/posts';
import { supabase } from '@/lib/supabase';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const siteName = tMeta('homeTitle');
  const description = tMeta('homeDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title: siteName,
    description,
    openGraph: {
      title: siteName,
      description,
      url: `${baseUrl}/${locale}`,
      siteName,
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: siteName }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: [`${baseUrl}/og-default.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'de': `${baseUrl}/de`,
        'en': `${baseUrl}/en`,
        'ru': `${baseUrl}/ru`,
        'ar': `${baseUrl}/ar`,
        'fr': `${baseUrl}/fr`,
        'hu': `${baseUrl}/hu`,
        'x-default': `${baseUrl}/de`,
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations({ locale, namespace: 'hero' });

  const heroTranslations = {
    eyebrow: tHero('eyebrow'),
    title: tHero('title'),
    subtitle: tHero('subtitle'),
    cta: tHero('cta'),
    secondary: tHero('secondary'),
    check1: tHero('check1'),
    check2: tHero('check2'),
    check3: tHero('check3'),
    benefits: tHero('benefits'),
  };

  const [destinations, allPosts, faqsResult] = await Promise.all([
    getDestinations(locale),
    getLocalizedAllBlogPosts(locale),
    supabase.from('faqs').select('question, answer').eq('locale', locale).order('sort_order', { ascending: true }),
  ]);

  let faqs = faqsResult.data ?? [];
  if (faqsResult.error || faqs.length === 0) {
    const fallback = await supabase.from('faqs').select('question, answer').eq('locale', 'de').order('sort_order', { ascending: true });
    faqs = fallback.data ?? [];
  }
  if (faqs.length === 0) {
    const legacy = await supabase.from('faqs').select('question, answer').order('sort_order', { ascending: true });
    faqs = legacy.data ?? [];
  }
  const featuredPosts = allPosts.filter(p => p.featured);
  const homepagePosts = featuredPosts.length >= 3
    ? featuredPosts.slice(0, 3)
    : allPosts.slice(0, 3);

  const bySlug = new Map(destinations.map(d => [d.slug, d]));
  const slugs = ['hurghada', 'el-gouna', 'safaga', 'makadi-bay', 'soma-bay'];
  const destinationCards = slugs.map((slug) => {
    const d = bySlug.get(slug);
    return {
      slug: d?.slug ?? slug,
      name: d?.name ?? slug,
      image: d?.image ?? '',
    };
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const siteName = tMeta('homeTitle');

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Hurghada Reiseplaner',
    alternateName: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/og-default.jpg`,
    description: tMeta('homeDescription'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hurghada',
      addressRegion: 'Red Sea',
      addressCountry: 'EG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+43 681 811 400 99',
      contactType: 'customer service',
      availableLanguage: ['German', 'English', 'Russian', 'Arabic', 'French', 'Hungarian'],
    },
    sameAs: [],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/touren?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <Hero {...heroTranslations} />
      <Destinations destinations={destinationCards} />
      <FeaturedTours locale={locale} />
      <CTA />
      <Features />
      <BlogPreview posts={homepagePosts} locale={locale} />
      <FAQ faqs={faqs} />
    </>
  );
}
