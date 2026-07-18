import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getAllBlogPosts, getLocalizedAllBlogPosts } from '@/lib/data/posts';
import BlogCard from '@/components/cards/BlogCard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
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
