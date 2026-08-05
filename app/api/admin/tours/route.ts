import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isTourSortOrderSupported } from '@/lib/data/tours';

function sanitizeItinerary(value: unknown): { title: string; content: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        return {
          title: typeof o.title === 'string' ? o.title : '',
          content: typeof o.content === 'string' ? o.content : '',
        };
      }
      return { title: '', content: '' };
    })
    .filter((i) => i.title.trim() !== '' || i.content.trim() !== '');
}

function sanitizeFAQs(value: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        return {
          question: typeof o.question === 'string' ? o.question : '',
          answer: typeof o.answer === 'string' ? o.answer : '',
        };
      }
      return { question: '', answer: '' };
    })
    .filter((i) => i.question.trim() !== '' || i.answer.trim() !== '');
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const base = supabase.from('tours').select('*');
  const ordered = (await isTourSortOrderSupported())
    ? base.order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false })
    : base.order('created_at', { ascending: false });
  const { data, error } = await ordered;
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
    const faqs = sanitizeFAQs(body.faqs);

    const tourRow: Record<string, unknown> = {
      name: body.name || '',  
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
      faqs,
    };
    if (body.discount !== undefined) tourRow.discount = body.discount;

    if (await isTourSortOrderSupported()) {
      const { data: maxRow } = await supabase
        .from('tours')
        .select('sort_order')
        .order('sort_order', { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      tourRow.sort_order = Number(maxRow?.sort_order ?? 0) + 1;
    }

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
      .select('*')
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
      meeting_point: body.meetingPoint || '',
      duration: body.duration || '',
    };

    const { error: trError } = await supabase
      .from('content_translations')
      .insert(trRow);

    if (trError) {
      console.error('Tour translation insert error:', trError);
    }

    let createdTour = tour;
    if (body.itinerary !== undefined) {
      const itinerary = sanitizeItinerary(body.itinerary);
      const { data: updatedTour, error: itineraryError } = await supabase
        .from('tours')
        .update({ itinerary, updated_at: new Date().toISOString() })
        .eq('id', tour.id)
        .select('*')
        .single();

      if (itineraryError) {
        console.error('Tour itinerary update error:', itineraryError);
      } else if (updatedTour) {
        createdTour = updatedTour;
      }
    }

    return NextResponse.json(createdTour, { status: 201 });
  } catch (e) {
    console.error('Tour create catch:', e);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
