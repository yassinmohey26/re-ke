import { getSupabaseAdmin } from '@/lib/supabase';

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
  const { data } = await db.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single();
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

  const { data, error } = await db
    .from('blog_post_translations')
    .select('*')
    .eq('post_slug', slug)
    .eq('locale', locale)
    .single();

  if (!data || error) return post;

  return {
    ...post,
    title: data.title || post.title,
    excerpt: data.excerpt || post.excerpt,
    content: data.content || post.content,
    category: data.category || post.category,
    readTime: data.read_time || post.readTime,
    tags: data.tags?.length ? data.tags : post.tags,
  };
}

export async function getLocalizedAllBlogPosts(locale: string): Promise<BlogPostData[]> {
  const posts = await getAllBlogPosts();
  if (locale === 'de') return posts;

  const slugs = posts.map((p) => p.slug);
  if (slugs.length === 0) return posts;

  const { data: translations, error: transErr } = await db
    .from('blog_post_translations')
    .select('*')
    .eq('locale', locale)
    .in('post_slug', slugs);

  if (!translations?.length || transErr) return posts;

  const transMap = new Map(translations.map((tr) => [tr.post_slug, tr]));

  return posts.map((post) => {
    const tr = transMap.get(post.slug);
    if (!tr) return post;
    return {
      ...post,
      title: tr.title || post.title,
      excerpt: tr.excerpt || post.excerpt,
      content: tr.content || post.content,
      category: tr.category || post.category,
      readTime: tr.read_time || post.readTime,
      tags: tr.tags?.length ? tr.tags : post.tags,
    };
  });
}
