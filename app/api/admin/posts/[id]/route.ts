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

    const postRow: Record<string, unknown> = {};

    if (body.slug !== undefined) postRow.slug = body.slug;
    if (body.image !== undefined) postRow.image = body.image;
    if (body.date !== undefined) postRow.date = body.date;
    if (body.author !== undefined) postRow.author = body.author;
    if (body.published !== undefined) postRow.published = body.published;
    if (body.featured !== undefined) postRow.featured = body.featured;

    if (Object.keys(postRow).length > 0) {
      postRow.updated_at = new Date().toISOString();

      const { error: postError } = await supabase
        .from('blog_posts')
        .update(postRow)
        .eq('id', id);

      if (postError) return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    const hasTrFields = body.title !== undefined || body.excerpt !== undefined || body.content !== undefined
      || body.category !== undefined || body.readTime !== undefined || body.tags !== undefined;

    if (hasTrFields) {
      const trRow: Record<string, unknown> = {
        table_name: 'blog_posts',
        row_id: id,
        locale,
      };
      if (body.title !== undefined) trRow.title = body.title;
      if (body.excerpt !== undefined) trRow.excerpt = body.excerpt;
      if (body.content !== undefined) trRow.content = body.content;
      if (body.category !== undefined) trRow.category = body.category;
      if (body.readTime !== undefined) trRow.read_time = body.readTime;
      if (body.tags !== undefined) trRow.tags = body.tags;

      const { error: trError } = await supabase
        .from('content_translations')
        .upsert(trRow, { onConflict: 'table_name,row_id,locale' });

      if (trError) console.error('Post translation upsert error:', trError);
    }

    const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single();
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
