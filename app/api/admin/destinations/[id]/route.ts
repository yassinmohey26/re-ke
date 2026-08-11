import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { revalidateDestinationPages } from '../revalidate';

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
  const { data: dest, error } = await supabase.from('destinations').select('*').eq('id', id).single();
  if (error || !dest) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: translations } = await supabase
    .from('content_translations')
    .select('*')
    .eq('table_name', 'destinations')
    .eq('row_id', id);

  const trMap: Record<string, any> = {};
  for (const tr of translations ?? []) {
    trMap[tr.locale] = tr;
  }

  return NextResponse.json({ ...dest, translations: trMap });
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

    const { data: current, error: currentError } = await supabase
      .from('destinations')
      .select('id, slug, image, featured, display_order')
      .eq('id', id)
      .single();
    if (currentError || !current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Homepage featured validation
    let featured = current.featured;
    let displayOrder = current.display_order;
    if (typeof body.featured === 'boolean') featured = body.featured;
    if (featured === false) {
      // Turning featured off always clears the homepage position
      displayOrder = null;
    } else if (body.display_order !== undefined && body.display_order !== null) {
      const parsed = Number(body.display_order);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
        return NextResponse.json({ error: 'display_order must be an integer between 1 and 5' }, { status: 400 });
      }
      displayOrder = parsed;
    }

    // Prevent duplicate featured positions (server-side check, excluding self)
    if (featured && displayOrder !== null) {
      const { data: conflict } = await supabase
        .from('destinations')
        .select('id')
        .eq('featured', true)
        .eq('display_order', displayOrder)
        .neq('id', id)
        .limit(1);
      if (conflict && conflict.length > 0) {
        return NextResponse.json({ error: `Homepage position ${displayOrder} is already used by another featured destination` }, { status: 409 });
      }
    }

    const updates: Record<string, unknown> = { featured, display_order: displayOrder };
    if (typeof body.slug === 'string') updates.slug = body.slug;
    if (typeof body.image === 'string') updates.image = body.image || '';

    const { data: dest, error: destError } = await supabase
      .from('destinations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (destError) return NextResponse.json({ error: destError.message }, { status: 500 });

    // Star-toggle requests ({ featured }) must NOT touch translations
    if (typeof body.name === 'string') {
      const { error: trError } = await supabase
        .from('content_translations')
        .upsert({
          table_name: 'destinations',
          row_id: id,
          locale,
          name: body.name || '',
          tagline: body.tagline || '',
          description: body.description || '',
        }, { onConflict: 'table_name,row_id,locale' });

      if (trError) console.error('Destination translation upsert error:', trError);
    }

    revalidateDestinationPages();

    return NextResponse.json(dest);
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

  await supabase.from('content_translations').delete().eq('table_name', 'destinations').eq('row_id', id);
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateDestinationPages();

  return NextResponse.json({ success: true });
}
