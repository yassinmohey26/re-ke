import { getSupabaseAdmin } from '@/lib/supabase';
import { translateBlogPost, translateAllBlogPosts } from './translate';

const db = getSupabaseAdmin();

export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
  featured: boolean;
}

function mapPost(row: any): BlogPostData {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    image: row.image ?? '',
    category: row.category ?? '',
    date: row.date ?? '',
    readTime: row.read_time ?? '',
    tags: row.tags ?? [],
    author: row.author ?? '',
    featured: row.featured ?? false,
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostData | undefined> {
  const { data, error } = await db.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single();
  if (error) {
    console.error('[posts] getBlogPostBySlug error:', error.message, 'slug:', slug);
  }
  if (!data) {
    console.error('[posts] getBlogPostBySlug: no data for slug:', slug);
  }
  return data ? mapPost(data) : undefined;
}

export async function getAllBlogPosts(): Promise<BlogPostData[]> {
  const { data } = await db
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false });
  return (data ?? []).map(mapPost);
}

export async function getFeaturedBlogPosts(): Promise<BlogPostData[]> {
  const { data } = await db
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('date', { ascending: false });
  return (data ?? []).map(mapPost);
}

export async function getLocalizedBlogPost(slug: string, locale: string): Promise<BlogPostData | undefined> {
  const post = await getBlogPostBySlug(slug);
  if (!post) return undefined;
  if (locale === 'de') return post;

  const tr = await translateBlogPost(post, locale);
  return {
    ...post,
    title: tr.title,
    excerpt: tr.excerpt,
    content: tr.content,
    category: tr.category,
    readTime: tr.readTime,
    tags: tr.tags,
  };
}

export async function getLocalizedAllBlogPosts(locale: string): Promise<BlogPostData[]> {
  const posts = await getAllBlogPosts();
  if (locale === 'de') return posts;

  const bulk = await translateAllBlogPosts(
    posts.map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      readTime: p.readTime,
      tags: p.tags,
    })),
    locale,
  );

  return posts.map((post, i) => ({
    ...post,
    title: bulk[i].title,
    excerpt: bulk[i].excerpt,
    content: bulk[i].content,
    category: bulk[i].category,
    readTime: bulk[i].readTime,
    tags: bulk[i].tags,
  }));
}
