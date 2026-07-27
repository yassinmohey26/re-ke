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
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        slug: body.slug,
        image: body.image || '',
        date: body.date || new Date().toISOString().split('T')[0],
        author: body.author || 'Reiseplaner Team',
        published: body.published !== false,
        featured: body.featured || false,
      })
      .select()
      .single();

    if (postError) return NextResponse.json({ error: postError.message }, { status: 500 });

    const { error: trError } = await supabase
      .from('content_translations')
      .insert({
        table_name: 'blog_posts',
        row_id: post.id,
        locale: 'de',
        title: body.title || '',
        excerpt: body.excerpt || '',
        content: body.content || '',
        category: body.category || '',
        read_time: body.readTime || '5 Min',
        tags: body.tags || [],
      });

    if (trError) console.error('Post translation insert error:', trError);

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
