'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import styles from './BlogPreview.module.css';

interface BlogPreviewPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

function formatDate(dateStr: string, locale: string = 'de'): string {
  const localeMap: Record<string, string> = { de: 'de-AT', en: 'en-US', ru: 'ru-RU', ar: 'ar-EG', fr: 'fr-FR', hu: 'hu-HU' };
  return new Date(dateStr).toLocaleDateString(localeMap[locale] || 'de-AT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPreview({ posts, locale = 'de' }: { posts: BlogPreviewPost[]; locale?: string }) {
  const t = useTranslations('homeBlog');
  const tBlog = useTranslations('blog');

  return (
    <section className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="section-eyebrow">{t('eyebrow')}</span>
            <h2 className="section-title">
              {t('titlePart1')} <span className="text-accent">{t('titleAccent')}</span>
            </h2>
          </div>
          <Link href="/blog" className="btn btn--ghost">
            {t('viewAll')}
          </Link>
        </div>
        <div className={styles.grid}>
          {posts.length === 0 ? (
            <p>{tBlog('noPosts')}</p>
          ) : (
            posts.map((post, i) => (
              <article
                key={post.slug}
                className={[styles.card, i === 0 ? styles.cardFeatured : ''].join(' ')}
              >
                <Link href={`/blog/${post.slug}`} className={styles.cardImgLink} tabIndex={-1} aria-hidden>
                  <div className={styles.cardImgWrap}>
                    {post.image && post.image.startsWith('http') ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className={styles.cardImg}
                        quality={80}
                        sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: 'var(--color-accent)' }} />
                    )}
                  </div>
                </Link>
                <div className={styles.cardBody}>
                  <div className={styles.meta}>
                    <span className={styles.category}>{post.category}</span>
                    <span className={styles.dot}>·</span>
                    <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                    <span className={styles.dot}>·</span>
                    <span>{post.readTime} {tBlog('readTime')}</span>
                  </div>
                  <h3 className={styles.title}>
                    <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                    {t('readMore')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
