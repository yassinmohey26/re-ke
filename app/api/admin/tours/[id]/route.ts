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
  const { data: tour, error } = await supabase.from('tours').select('*').eq('id', id).single();
  if (error || !tour) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: translations } = await supabase
    .from('content_translations')
    .select('*')
    .eq('table_name', 'tours')
    .eq('row_id', id);

  const trMap: Record<string, any> = {};
  for (const tr of translations ?? []) {
    trMap[tr.locale] = tr;
  }

  return NextResponse.json({ ...tour, translations: trMap });
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

    const tourRow: Record<string, unknown> = {
      slug: body.slug,
      price: body.price ?? null,
      duration_hours: body.durationHours || 0,
      max_guests: body.maxGuests || 8,
      difficulty: body.difficulty || 'leicht',
      min_age: body.minAge || 4,
      destination: body.destination || '',
      category: body.category || 'halbtag',
      image: body.image || '',
      featured: body.featured || false,
      active: body.active !== false,
      updated_at: new Date().toISOString(),
    };

    if (body.destinationSlug) {
      const { data: dest } = await supabase
        .from('destinations')
        .select('slug')
        .eq('slug', body.destinationSlug)
        .single();
      if (dest) tourRow.destination_slug = dest.slug;
      else tourRow.destination_slug = null;
    } else {
      tourRow.destination_slug = null;
    }

    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .update(tourRow)
      .eq('id', id)
      .select()
      .single();

    if (tourError) {
      console.error('Tour update error:', tourError);
      return NextResponse.json({ error: tourError.message }, { status: 500 });
    }

    const trRow = {
      table_name: 'tours',
      row_id: id,
      locale,
      name: body.name || '',
      short_description: body.shortDescription || '',
      description: body.description || '',
      category_label: body.categoryLabel || '',
      highlights: body.highlights || [],
      included: body.included || [],
      not_included: body.notIncluded || [],
      itinerary: body.itinerary || [],
      faqs: body.faqs || [],
      meeting_point: body.meetingPoint || '',
      duration: body.duration || '',
    };

    const { error: trError } = await supabase
      .from('content_translations')
      .upsert(trRow, { onConflict: 'table_name,row_id,locale' });

    if (trError) {
      console.error('Tour translation upsert error:', trError);
    }

    return NextResponse.json(tour);
  } catch (e) {
    console.error('Tour update catch:', e);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
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

  await supabase.from('content_translations').delete().eq('table_name', 'tours').eq('row_id', id);
  const { error } = await supabase.from('tours').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
