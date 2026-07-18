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

  const tourIds = (data ?? []).map((t: any) => t.slug);
  const { data: translations } = await supabase
    .from('tour_translations')
    .select('*')
    .in('tour_slug', tourIds);

  const transMap = new Map<string, any[]>();
  for (const tr of translations ?? []) {
    if (!transMap.has(tr.tour_slug)) transMap.set(tr.tour_slug, []);
    transMap.get(tr.tour_slug)!.push(tr);
  }

  const tours = (data ?? []).map((t: any) => ({
    ...t,
    translations: transMap.get(t.slug) ?? [],
  }));

  return NextResponse.json(tours);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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
    };

    if (body.destinationSlug) {
      const { data: dest } = await supabase
        .from('destinations')
        .select('slug')
        .eq('slug', body.destinationSlug)
        .single();
      if (dest) row.destination_slug = dest.slug;
    }

    const { data, error } = await supabase
      .from('tours')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Tour insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.translations && typeof body.translations === 'object') {
      const transRows = Object.entries(body.translations)
        .filter(([locale]) => locale !== 'de')
        .map(([locale, tr]: [string, any]) => ({
          tour_slug: body.slug,
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

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error('Tour create catch:', e);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
