import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { supabase } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';

const FIXED_ROUTES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/touren', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/destinationen', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/kontakt', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/faq', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/datenschutz', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/impressum', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/touren/ganztagstouren', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/touren/halbtagstouren', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/touren/wassersport', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/touren/wuesten-safari', priority: 0.8, changeFrequency: 'weekly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const { data: tours } = await supabase.from('tours').select('slug');
  const { data: posts } = await supabase.from('blog_posts').select('slug, date').eq('published', true);
  const { data: destinations } = await supabase.from('destinations').select('slug');

  for (const locale of locales) {
    // Fixed routes
    for (const route of FIXED_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }

    // Dynamic tour routes
    for (const tour of tours ?? []) {
      entries.push({
        url: `${BASE_URL}/${locale}/touren/${tour.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Dynamic blog post routes
    for (const post of posts ?? []) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Dynamic destination routes
    for (const dest of destinations ?? []) {
      entries.push({
        url: `${BASE_URL}/${locale}/destinationen/${dest.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
