import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getLocalizedAllBlogPosts } from '@/lib/data/posts';
import BlogCard from '@/components/cards/BlogCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = t('pageTitle');
  const description = t('pageDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/blog`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${baseUrl}/og-default.jpg`] },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        'de': `${baseUrl}/de/blog`,
        'en': `${baseUrl}/en/blog`,
        'ru': `${baseUrl}/ru/blog`,
        'ar': `${baseUrl}/ar/blog`,
        'fr': `${baseUrl}/fr/blog`,
        'hu': `${baseUrl}/hu/blog`,
        'x-default': `${baseUrl}/de/blog`,
      },
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const posts = await getLocalizedAllBlogPosts(locale);

  return (
    <section className="section">
      <div className="container">
        <div style={{ maxWidth: 'var(--max-w-lg)', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h1 className="section-title">{t('pageTitle')}</h1>
          <p className="section-desc">{t('pageDescription')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-8)' }}>
          {posts.length === 0 ? (
            <p>{t('noPosts')}</p>
          ) : (
            posts.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
