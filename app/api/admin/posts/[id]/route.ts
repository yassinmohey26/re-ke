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
  const { data: post, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
  if (error || !post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: translations } = await supabase
    .from('content_translations')
    .select('*')
    .eq('table_name', 'blog_posts')
    .eq('row_id', id);

  const trMap: Record<string, any> = {};
  for (const tr of translations ?? []) {
    trMap[tr.locale] = tr;
  }

  return NextResponse.json({ ...post, translations: trMap });
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
    const locale = body.locale || 'de';

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .update({
        slug: body.slug,
        image: body.image || '',
        date: body.date,
        author: body.author || 'Reiseplaner Team',
        published: body.published !== false,
        featured: body.featured || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (postError) return NextResponse.json({ error: postError.message }, { status: 500 });

    const { error: trError } = await supabase
      .from('content_translations')
      .upsert({
        table_name: 'blog_posts',
        row_id: id,
        locale,
        title: body.title || '',
        excerpt: body.excerpt || '',
        content: body.content || '',
        category: body.category || '',
        read_time: body.readTime || '5 Min',
        tags: body.tags || [],
      }, { onConflict: 'table_name,row_id,locale' });

    if (trError) console.error('Post translation upsert error:', trError);

    return NextResponse.json(post);
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

  await supabase.from('content_translations').delete().eq('table_name', 'blog_posts').eq('row_id', id);
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
