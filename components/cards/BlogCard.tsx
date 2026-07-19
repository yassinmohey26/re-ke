import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './BlogCard.module.css';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

function formatDate(dateStr: string, locale: string = 'de'): string {
  const localeMap: Record<string, string> = { de: 'de-AT', en: 'en-US', ru: 'ru-RU' };
  return new Date(dateStr).toLocaleDateString(localeMap[locale] || 'de-AT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogCard({ post, featured = false, locale = 'de' }: { post: BlogPost; featured?: boolean; locale?: string }) {
  const t = await getTranslations('blog');
  const tCommon = await getTranslations('common');

  return (
    <article className={[styles.card, featured ? styles.featured : ''].filter(Boolean).join(' ')}>
      <Link href={`/blog/${post.slug}`} className={styles.imgLink} tabIndex={-1} aria-hidden>
        <div className={styles.imgWrap}>
          {post.image && post.image.startsWith('http') ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className={styles.img}
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--color-accent)' }} />
          )}
        </div>
      </Link>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>{post.category}</span>
          <span className={styles.dot}>·</span>
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <span className={styles.dot}>·</span>
          <span>{post.readTime} {t('readTime')}</span>
        </div>
        <h3 className={styles.title}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
          {tCommon('readMore')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
