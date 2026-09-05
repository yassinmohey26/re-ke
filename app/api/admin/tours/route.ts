import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isTourSortOrderSupported } from '@/lib/data/tours';
import { sanitizeChildDiscountInput, type ChildDiscountInput } from '@/lib/child-discounts';

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

function sanitizeParticipantPrices(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object').map((item) => ({
    person_type: item.personType,
    price: Number(item.price ?? 0),
    currency: typeof item.currency === 'string' ? item.currency.toUpperCase() : 'EUR',
    min_age: Number(item.minAge), max_age: Number(item.maxAge),
    is_active: item.isActive !== false,
  })).filter((item) => ['adult', 'child', 'infant'].includes(String(item.person_type)) && Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(item.min_age) && Number.isInteger(item.max_age) && item.min_age >= 0 && item.max_age >= item.min_age && /^[A-Z]{3}$/.test(item.currency));
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

  const tours = data ?? [];
  if (tours.length === 0) return NextResponse.json([]);

  const tourIds = tours.map((tour) => tour.id);
  const [{ data: translations }, { data: childDiscounts }] = await Promise.all([
    supabase
      .from('content_translations')
      .select('row_id, locale, name, short_description, description')
      .eq('table_name', 'tours')
      .in('row_id', tourIds),
    supabase
      .from('tour_child_discounts')
      .select('tour_id')
      .in('tour_id', tourIds),
  ]);

  const supportedLocales = ['de', 'en', 'fr', 'hu', 'ru', 'ar'] as const;
  const translationsByTour = new Map<string, Set<string>>();
  for (const translation of translations ?? []) {
    const hasCoreContent = Boolean(
      String(translation.name ?? '').trim()
      && String(translation.short_description ?? '').trim()
      && String(translation.description ?? '').trim(),
    );
    if (!hasCoreContent || !supportedLocales.includes(translation.locale as typeof supportedLocales[number])) continue;
    const locales = translationsByTour.get(translation.row_id) ?? new Set<string>();
    locales.add(translation.locale);
    translationsByTour.set(translation.row_id, locales);
  }

  const toursWithChildDiscounts = new Set((childDiscounts ?? []).map((row) => row.tour_id));
  const hasItems = (value: unknown): boolean => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value !== 'string' || !value.trim()) return false;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.length > 0 : Boolean(parsed);
    } catch {
      return true;
    }
  };

  return NextResponse.json(tours.map((tour) => {
    const completedLocales = translationsByTour.get(tour.id) ?? new Set<string>();
    const translationStatus = Object.fromEntries(
      supportedLocales.map((locale) => [locale, completedLocales.has(locale)]),
    );
    const checks = {
      content: Boolean(String(tour.name ?? '').trim() && String(tour.slug ?? '').trim() && String(tour.description ?? '').trim()),
      image: hasItems(tour.image),
      pricing: Number.isFinite(Number(tour.price)) && Number(tour.price) > 0,
      childDiscounts: toursWithChildDiscounts.has(tour.id),
      itinerary: hasItems(tour.itinerary),
      faqs: hasItems(tour.faqs),
      translations: supportedLocales.every((locale) => completedLocales.has(locale)),
    };
    const completeCount = Object.values(checks).filter(Boolean).length;

    return {
      ...tour,
      adminMeta: {
        translationStatus,
        completeness: {
          percent: Math.round((completeCount / Object.keys(checks).length) * 100),
          checks,
        },
      },
    };
  }));
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
    if (body.meetingPoint !== undefined) tourRow.meeting_point = body.meetingPoint;
    if (body.pickupTimeSlots !== undefined) tourRow.pickup_time_slots = body.pickupTimeSlots;

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
      name: body.deName || body.name || '',
      short_description: body.shortDescription || '',
      description: body.description || '',
      category_label: body.categoryLabel || '',
      highlights: body.highlights || [],
      included: body.included || [],
      not_included: body.notIncluded || [],
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

    if (Array.isArray(body.childDiscounts)) {
      const childDiscountRows = (body.childDiscounts as Record<string, unknown>[])
        .map((item) => sanitizeChildDiscountInput(item))
        .filter((input): input is ChildDiscountInput => input !== null)
        .map((input, index) => ({
          tour_id: tour.id,
          age_from: input.age_from,
          age_to: input.age_to,
          discount_type: input.discount_type,
          discount_value: input.discount_value,
          sort_order: input.sort_order ?? index,
        }));

      if (childDiscountRows.length > 0) {
        const { error: childDiscountError } = await supabase
          .from('tour_child_discounts')
          .insert(childDiscountRows);
        if (childDiscountError) {
          console.error('Tour child discounts insert error:', childDiscountError);
        }
      }
    }

    if (Array.isArray(body.participantPrices)) {
      const rows = sanitizeParticipantPrices(body.participantPrices).map((row) => ({ ...row, tour_id: tour.id }));
      for (const row of rows) {
        const { data: existing } = await supabase.from('tour_participant_prices').select('id').eq('tour_id', tour.id).eq('person_type', row.person_type).maybeSingle();
        const result = existing
          ? await supabase.from('tour_participant_prices').update(row).eq('id', existing.id)
          : await supabase.from('tour_participant_prices').insert(row);
        if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });
      }
    }

    return NextResponse.json(createdTour, { status: 201 });
  } catch (e) {
    console.error('Tour create catch:', e);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
