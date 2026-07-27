import { getSupabaseAdmin } from '@/lib/supabase';

const db = getSupabaseAdmin();

export interface BlogPostData {
  id?: string;
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

function parseStr(val: unknown, fallback: string): string {
  if (typeof val === 'string') return val;
  return fallback;
}

function parseArr(val: unknown, fallback: string[]): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
  return fallback;
}

function mergePostTranslation(row: any, tr: any): BlogPostData {
  return {
    id: row.id,
    slug: row.slug,
    title: parseStr(tr?.title || tr?.name, row.title),
    excerpt: parseStr(tr?.excerpt || tr?.short_description, row.excerpt ?? ''),
    content: parseStr(tr?.content || tr?.description, row.content ?? ''),
    image: row.image ?? '',
    category: parseStr(tr?.category || tr?.category_label, row.category ?? ''),
    date: row.date ?? '',
    readTime: parseStr(tr?.read_time || tr?.duration, row.read_time ?? ''),
    tags: parseArr(tr?.tags, row.tags ?? []),
    author: row.author ?? '',
    featured: row.featured ?? false,
  };
}

async function getTranslationsMap(
  tableName: string,
  rowIds: string[],
  locale: string,
): Promise<Map<string, any>> {
  if (rowIds.length === 0) return new Map();
  const map = new Map<string, any>();

  const { data } = await db
    .from('content_translations')
    .select('*')
    .eq('table_name', tableName)
    .eq('locale', locale)
    .in('row_id', rowIds);

  if (data) {
    for (const row of data) map.set(row.row_id, row);
  }

  const missingIds = rowIds.filter(id => !map.has(id));
  if (missingIds.length > 0 && locale !== 'de') {
    const { data: deData } = await db
      .from('content_translations')
      .select('*')
      .eq('table_name', tableName)
      .eq('locale', 'de')
      .in('row_id', missingIds);
    if (deData) {
      for (const row of deData) map.set(row.row_id, row);
    }
  }

  return map;
}

async function getSingleTranslation(
  tableName: string,
  rowId: string,
  locale: string,
): Promise<any> {
  const { data } = await db
    .from('content_translations')
    .select('*')
    .eq('table_name', tableName)
    .eq('row_id', rowId)
    .eq('locale', locale)
    .limit(1)
    .maybeSingle();

  if (data || locale === 'de') return data ?? null;

  const { data: deData } = await db
    .from('content_translations')
    .select('*')
    .eq('table_name', tableName)
    .eq('row_id', rowId)
    .eq('locale', 'de')
    .limit(1)
    .maybeSingle();

  return deData ?? null;
}

export async function getBlogPostBySlug(slug: string, locale: string = 'de'): Promise<BlogPostData | undefined> {
  const { data: row } = await db.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single();
  if (!row) return undefined;
  const tr = await getSingleTranslation('blog_posts', row.id, locale);
  return mergePostTranslation(row, tr);
}

export async function getAllBlogPosts(locale: string = 'de'): Promise<BlogPostData[]> {
  const { data: rows } = await db
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false });
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('blog_posts', rows.map(r => r.id), locale);
  return rows.map(row => mergePostTranslation(row, trMap.get(row.id) ?? null));
}

export async function getFeaturedBlogPosts(locale: string = 'de'): Promise<BlogPostData[]> {
  const { data: rows } = await db
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('date', { ascending: false });
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('blog_posts', rows.map(r => r.id), locale);
  return rows.map(row => mergePostTranslation(row, trMap.get(row.id) ?? null));
}

export async function getLocalizedBlogPost(slug: string, locale: string): Promise<BlogPostData | undefined> {
  return getBlogPostBySlug(slug, locale);
}

export async function getLocalizedAllBlogPosts(locale: string): Promise<BlogPostData[]> {
  return getAllBlogPosts(locale);
}
