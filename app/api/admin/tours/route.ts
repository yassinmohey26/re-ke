import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
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
    };

    if (body.destinationSlug) {
      const { data: dest } = await supabase
        .from('destinations')
        .select('slug')
        .eq('slug', body.destinationSlug)
        .single();
      if (dest) tourRow.destination_slug = dest.slug;
    }

    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .insert(tourRow)
      .select()
      .single();

    if (tourError) {
      console.error('Tour insert error:', tourError);
      return NextResponse.json({ error: tourError.message }, { status: 500 });
    }

    const trRow = {
      table_name: 'tours',
      row_id: tour.id,
      locale: 'de',
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
      .insert(trRow);

    if (trError) {
      console.error('Tour translation insert error:', trError);
    }

    return NextResponse.json(tour, { status: 201 });
  } catch (e) {
    console.error('Tour create catch:', e);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
