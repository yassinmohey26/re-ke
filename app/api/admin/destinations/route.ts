import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { revalidateDestinationPages } from './revalidate';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });
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

    if (typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Destination name is required' }, { status: 400 });
    }
    const name = body.name.trim();

    const slug = typeof body.slug === 'string' && body.slug.trim()
      ? body.slug.trim()
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!slug) {
      return NextResponse.json({ error: 'Destination slug is required' }, { status: 400 });
    }

    const { data: dest, error: destError } = await supabase
      .from('destinations')
      .insert({
        name,
        slug,
        tagline: body.tagline || '',
        description: body.description || '',
        image: body.image || '',
        display_order: null,
      })
      .select()
      .single();

    if (destError) return NextResponse.json({ error: destError.message }, { status: 500 });

    const { error: trError } = await supabase
      .from('content_translations')
      .insert({
        table_name: 'destinations',
        row_id: dest.id,
        locale: 'de',
        name,
        tagline: body.tagline || '',
        description: body.description || '',
      });

    if (trError) console.error('Destination translation insert error:', trError);

    revalidateDestinationPages();

    return NextResponse.json(dest, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}
