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
  const { data, error } = await supabase.from('destinations').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: translations } = await supabase
    .from('destination_translations')
    .select('*')
    .eq('destination_slug', data.slug);

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

    const row: Record<string, unknown> = {
      name: body.name,
      slug: body.slug,
      tagline: body.tagline || '',
      description: body.description || '',
      image: body.image || '',
    };

    const { data, error } = await supabase
      .from('destinations')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (body.translations && typeof body.translations === 'object') {
      const destSlug = body.slug || data.slug;
      const transRows = Object.entries(body.translations)
        .filter(([locale]) => locale !== 'de')
        .map(([locale, tr]: [string, any]) => ({
          destination_slug: destSlug,
          locale,
          tagline: tr.tagline || '',
          description: tr.description || '',
        }));
      if (transRows.length > 0) {
        await supabase.from('destination_translations').upsert(transRows, { onConflict: 'destination_slug,locale' });
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
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
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
