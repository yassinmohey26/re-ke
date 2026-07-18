import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getBlogPostBySlug, getAllBlogPosts, getLocalizedBlogPost, getLocalizedAllBlogPosts } from '@/lib/data/posts';
import styles from './page.module.css';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getLocalizedBlogPost(slug, locale);
  if (!post) return { title: 'Not found' };
  return { title: post.title, description: post.excerpt };
}

export function generateStaticParams() {
  return [];
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === 'de' ? 'de-AT' : locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const post = await getLocalizedBlogPost(slug, locale);
  if (!post) notFound();

  const allPosts = await getLocalizedAllBlogPosts(locale);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const hasHeroImage = post.image && post.image.startsWith('http');

  return (
    <>
      {/* Hero Image */}
      <div className={styles.hero}>
        {hasHeroImage ? (
          <Image src={post.image} alt={post.title} fill className={styles.heroImg} priority sizes="100vw" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--color-accent)' }} />
        )}
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.category}>{post.category}</span>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>{post.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className={styles.article}>
        <div className="container">
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />

          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className={`section ${styles.related}`}>
          <div className="container">
            <h2 className="section-title">{t('relatedPosts')}</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.relatedCard}>
                  <div className={styles.relatedImgWrap}>
                    {p.image && p.image.startsWith('http') ? (
                      <Image src={p.image} alt={p.title} fill className={styles.relatedImg} sizes="(max-width: 768px) 100vw, 50vw" />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: 'var(--color-accent)' }} />
                    )}
                  </div>
                  <div className={styles.relatedBody}>
                    <span className={styles.relatedCategory}>{p.category}</span>
                    <h3 className={styles.relatedTitle}>{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to blog */}
      <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>
        <Link href="/blog" className="btn btn--outline">
          ← {t('backToBlog')}
        </Link>
      </div>
    </>
  );
}
