import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: translations } = await supabase
    .from('blog_post_translations')
    .select('*')
    .eq('post_slug', data.slug);

  return NextResponse.json({ ...data, translations: translations ?? [] });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt || '',
        content: body.content || '',
        image: body.image || '',
        category: body.category || '',
        date: body.date,
        read_time: body.readTime || '5 Min',
        tags: body.tags || [],
        author: body.author || 'Reiseplaner Team',
        published: body.published !== false,
        featured: body.featured || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (body.translations && typeof body.translations === 'object') {
      const postSlug = body.slug || data.slug;
      const transRows = Object.entries(body.translations)
        .filter(([locale]) => locale !== 'de')
        .map(([locale, tr]: [string, any]) => ({
          post_slug: postSlug,
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

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
