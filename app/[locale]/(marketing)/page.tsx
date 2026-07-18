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
import { getAllBlogPosts, getLocalizedAllBlogPosts } from '@/lib/data/posts';
import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: tMeta('homeTitle'),
    description: tMeta('homeDescription'),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [destinations, allPosts, faqsResult] = await Promise.all([
    getDestinations(),
    getLocalizedAllBlogPosts(locale),
    supabase.from('faqs').select('question, answer').eq('locale', locale).order('sort_order', { ascending: true }),
  ]);

  let faqs = faqsResult.data ?? [];
  if (faqsResult.error && faqsResult.error.message?.includes('locale')) {
    const fallback = await supabase.from('faqs').select('question, answer').order('sort_order', { ascending: true });
    faqs = fallback.data ?? [];
  }
  const featuredPosts = allPosts.filter(p => p.featured);
  const homepagePosts = featuredPosts.length >= 3
    ? featuredPosts.slice(0, 3)
    : allPosts.slice(0, 3);

  const bySlug = new Map(destinations.map(d => [d.slug, d]));
  const ordered = [
    'hurghada', 'el-gouna', 'safaga',
    'makadi-bay', 'soma-bay', 'quseir',
  ].map(slug => bySlug.get(slug)).filter(Boolean) as typeof destinations;

  const destinationCards = ordered.map((d, i) => ({
    slug: d.slug,
    name: d.name,
    image: d.image,
    size: (i === 0 || i === 3) ? 'large' as const : 'small' as const,
  }));

  return (
    <>
      <Hero />
      <Destinations destinations={destinationCards} />
      <FeaturedTours locale={locale} />
      <Features />
      <BlogPreview posts={homepagePosts} locale={locale} />
      <FAQ faqs={faqs} />
      <CTA />
    </>
  );
}
