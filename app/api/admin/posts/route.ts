import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const postSlugs = (data ?? []).map((p: any) => p.slug);
  const { data: translations } = await supabase
    .from('blog_post_translations')
    .select('*')
    .in('post_slug', postSlugs);

  const transMap = new Map<string, any[]>();
  for (const tr of translations ?? []) {
    if (!transMap.has(tr.post_slug)) transMap.set(tr.post_slug, []);
    transMap.get(tr.post_slug)!.push(tr);
  }

  const posts = (data ?? []).map((p: any) => ({
    ...p,
    translations: transMap.get(p.slug) ?? [],
  }));

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt || '',
        content: body.content || '',
        image: body.image || '',
        category: body.category || '',
        date: body.date || new Date().toISOString().split('T')[0],
        read_time: body.readTime || '5 Min',
        tags: body.tags || [],
        author: body.author || 'Reiseplaner Team',
        published: body.published !== false,
        featured: body.featured || false,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (body.translations && typeof body.translations === 'object') {
      const transRows = Object.entries(body.translations)
        .filter(([locale]) => locale !== 'de')
        .map(([locale, tr]: [string, any]) => ({
          post_slug: body.slug,
          locale,
          title: tr.title || '',
          excerpt: tr.excerpt || '',
          content: tr.content || '',
          category: tr.category || '',
          read_time: tr.readTime || '',
          tags: tr.tags || [],
        }));
      if (transRows.length > 0) {
        await supabase.from('blog_post_translations').upsert(transRows, { onConflict: 'post_slug,locale' });
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
