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
  const { data, error } = await supabase.from('tours').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: translations } = await supabase
    .from('tour_translations')
    .select('*')
    .eq('tour_slug', data.slug);

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
      slug: body.slug,
      name: body.name,
      short_description: body.shortDescription || '',
      description: body.description || '',
      price: body.price ?? null,
      duration: body.duration || '',
      duration_hours: body.durationHours || 0,
      max_guests: body.maxGuests || 8,
      difficulty: body.difficulty || 'leicht',
      min_age: body.minAge || 4,
      destination: body.destination || '',
      category: body.category || 'halbtag',
      category_label: body.categoryLabel || '',
      highlights: body.highlights || [],
      included: body.included || [],
      not_included: body.notIncluded || [],
      itinerary: body.itinerary || [],
      faqs: body.faqs || [],
      image: body.image || '',
      meeting_point: body.meetingPoint || '',
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
      if (dest) row.destination_slug = dest.slug;
      else row.destination_slug = null;
    } else {
      row.destination_slug = null;
    }

    const { data, error } = await supabase
      .from('tours')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Tour update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.translations && typeof body.translations === 'object') {
      const tourSlug = body.slug || data.slug;
      const transRows = Object.entries(body.translations)
        .filter(([locale]) => locale !== 'de')
        .map(([locale, tr]: [string, any]) => ({
          tour_slug: tourSlug,
          locale,
          name: tr.name || '',
          short_description: tr.shortDescription || '',
          description: tr.description || '',
          category_label: tr.categoryLabel || '',
          highlights: tr.highlights || [],
          included: tr.included || [],
          not_included: tr.notIncluded || [],
          itinerary: tr.itinerary || [],
          faqs: tr.faqs || [],
          meeting_point: tr.meetingPoint || '',
          duration: tr.duration || '',
        }));
      if (transRows.length > 0) {
        await supabase.from('tour_translations').upsert(transRows, { onConflict: 'tour_slug,locale' });
      }
    }

    return NextResponse.json(data);
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
  const { error } = await supabase.from('tours').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
