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

function sanitizeParticipantPrices(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object').map((item) => ({
    person_type: item.personType, price: Number(item.price ?? 0),
    currency: typeof item.currency === 'string' ? item.currency.toUpperCase() : 'EUR',
    min_age: Number(item.minAge), max_age: Number(item.maxAge), is_active: item.isActive !== false,
  })).filter((item) => ['adult', 'child', 'infant'].includes(String(item.person_type)) && Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(item.min_age) && Number.isInteger(item.max_age) && item.min_age >= 0 && item.max_age >= item.min_age && /^[A-Z]{3}$/.test(item.currency));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'de';
  const supabase = getSupabaseAdmin();
  const { data: tour, error } = await supabase.from('tours').select('*').eq('id', id).single();
  if (error || !tour) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { data: participantPrices } = await supabase.from('tour_participant_prices').select('*').eq('tour_id', id);

  const { data: translations } = await supabase
    .from('content_translations')
    .select('*')
    .eq('table_name', 'tours')
    .eq('row_id', id);

  const trMap: Record<string, any> = {};
  for (const tr of translations ?? []) {
    trMap[tr.locale] = tr;
  }

  // Compute rawDescription: the field that contains the pricing table HTML.
  // The table is always in German so we search in order:
  // 1. DE translation description
  // 2. Any translation description that contains the table
  // 3. EAV joined string parts in DE translation (if name contains '---تسيب---')
  // 4. Base tours.description column
  function findPricingTableHtml(): string {
    const TABLE_RE = /tour-pricing-table/;

    // 1. DE translation description directly
    const deTr = trMap['de'];
    if (deTr?.description && TABLE_RE.test(deTr.description)) return deTr.description;

    // 2. Any other translation description
    for (const tr of Object.values(trMap) as any[]) {
      if (tr?.description && TABLE_RE.test(tr.description)) return tr.description;
    }

    // 3. EAV joined string — split by separator and search parts
    if (deTr?.name && typeof deTr.name === 'string' && deTr.name.includes('---')) {
      const parts = deTr.name.split(/---\s*تسيب\s*---/);
      for (const part of parts) {
        if (TABLE_RE.test(part)) return part.trim();
      }
    }
    // Also check any locale's name field
    for (const tr of Object.values(trMap) as any[]) {
      if (tr?.name && typeof tr.name === 'string' && tr.name.includes('---')) {
        const parts = tr.name.split(/---\s*تسيب\s*---/);
        for (const part of parts) {
          if (TABLE_RE.test(part)) return part.trim();
        }
      }
    }

    // 4. Base column fallback
    return tour?.description || '';
  }

  const rawDescription = findPricingTableHtml();

  // Resolve the itinerary for the ACTIVE locale so the form never falls back to
  // base `tours.itinerary` (German) when a different locale is selected.
  // German master → base tours.itinerary; other locales → itinerary JSONB or the
  // legacy `content` TEXT-JSON column on this locale's translation row.
  function parseItin(val: unknown): any[] {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  }

  let activeItinerary: any[] = [];
  if (locale === 'de') {
    activeItinerary = parseItin(tour.itinerary);
  } else {
    const activeTr = trMap[locale];
    activeItinerary = parseItin(activeTr?.itinerary);
    if (activeItinerary.length === 0 && activeTr?.content) {
      activeItinerary = parseItin(activeTr.content);
    }
  }

  const translation = trMap[locale]
    ? { ...trMap[locale], itinerary: activeItinerary }
    : { itinerary: activeItinerary };

  return NextResponse.json({
    ...tour,
    participantPrices: Object.fromEntries((participantPrices ?? []).map((p: any) => [p.person_type, { price: Number(p.price), currency: p.currency, minAge: p.min_age, maxAge: p.max_age, isActive: p.is_active }])),
    translations: trMap,
    translation,
    activeLocale: locale,
    activeItinerary,
    rawDescription,
  });

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
    const SUPPORTED_LOCALES = ['de', 'en', 'fr', 'hu', 'ru', 'ar'];
    const locale = body.locale || 'de';
    if (!SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
    }

    const tourRow: Record<string, unknown> = {};

    // ── SHARED / structural fields → base `tours` table (written for ANY locale) ──
    if (body.slug !== undefined) tourRow.slug = body.slug;
    if (body.price !== undefined) tourRow.price = body.price ?? null;
    if (body.durationHours !== undefined) tourRow.duration_hours = body.durationHours;
    if (body.maxGuests !== undefined) tourRow.max_guests = body.maxGuests;
    if (body.difficulty !== undefined) tourRow.difficulty = body.difficulty;
    if (body.minAge !== undefined) tourRow.min_age = body.minAge;
    if (body.destination !== undefined) tourRow.destination = body.destination;
    if (body.category !== undefined) tourRow.category = body.category;
    if (body.image !== undefined) tourRow.image = body.image;
    if (body.featured !== undefined) tourRow.featured = body.featured;
    if (body.active !== undefined) tourRow.active = body.active;
    if (body.discount !== undefined) tourRow.discount = body.discount;
    if (body.sortOrder !== undefined && await isTourSortOrderSupported()) tourRow.sort_order = body.sortOrder;
    if (body.pickupTimeSlots !== undefined) tourRow.pickup_time_slots = body.pickupTimeSlots;

    if (body.destinationSlug !== undefined) {
      if (body.destinationSlug) {
        const { data: dest } = await supabase
          .from('destinations')
          .select('slug')
          .eq('slug', body.destinationSlug)
          .single();
        tourRow.destination_slug = dest ? dest.slug : null;
      } else {
        tourRow.destination_slug = null;
      }
    }

    // ── LOCALIZED fields ──
    // German is the master language: for `de` the localized fields are persisted
    // in the base `tours` columns (which the public render reads for `de`).
    // For every other locale the SAME fields are persisted ONLY in the requested
    // locale's `content_translations` row. No other locale is ever written.
    const localized: Record<string, unknown> = {};
    if (body.name !== undefined) localized.name = body.name;
    if (body.shortDescription !== undefined) localized.short_description = body.shortDescription;
    if (body.description !== undefined) localized.description = body.description;
    if (body.categoryLabel !== undefined) localized.category_label = body.categoryLabel;
    if (body.highlights !== undefined) localized.highlights = body.highlights;
    if (body.included !== undefined) localized.included = body.included;
    if (body.notIncluded !== undefined) localized.not_included = body.notIncluded;
    if (body.faqs !== undefined) localized.faqs = sanitizeFAQs(body.faqs);
    if (body.meetingPoint !== undefined) localized.meeting_point = body.meetingPoint;
    if (body.duration !== undefined) localized.duration = body.duration;
    if (body.itinerary !== undefined) localized.itinerary = sanitizeItinerary(body.itinerary);

    const trRow: Record<string, unknown> = {};

    if (locale === 'de') {
      // German master → base columns (and the de translation row stays in sync).
      Object.assign(tourRow, localized);
      if (body.deName !== undefined) trRow.name = body.deName;
    } else {
      // Non-German → ONLY this locale's translation row.
      Object.assign(trRow, localized);
    }

    if (Object.keys(tourRow).length > 0) {
      tourRow.updated_at = new Date().toISOString();

      const { error: tourError } = await supabase
        .from('tours')
        .update(tourRow)
        .eq('id', id);

      if (tourError) {
        console.error('Tour update error:', tourError);
        return NextResponse.json({ error: tourError.message }, { status: 500 });
      }
    }

    if (Object.keys(trRow).length > 0) {
      trRow.table_name = 'tours';
      trRow.row_id = id;
      trRow.locale = locale;

      const { error: trError } = await supabase
        .from('content_translations')
        .upsert(trRow, { onConflict: 'table_name,row_id,locale' });

      if (trError) {
        console.error('Tour translation upsert error:', trError);
        return NextResponse.json({ error: trError.message }, { status: 500 });
      }
    }

    const { data: tour } = await supabase.from('tours').select('*').eq('id', id).single();
    if (Array.isArray(body.participantPrices)) {
      for (const row of sanitizeParticipantPrices(body.participantPrices)) {
        const { data: existing } = await supabase.from('tour_participant_prices').select('id').eq('tour_id', id).eq('person_type', row.person_type).maybeSingle();
        const result = existing ? await supabase.from('tour_participant_prices').update(row).eq('id', existing.id) : await supabase.from('tour_participant_prices').insert({ ...row, tour_id: id });
        if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });
      }
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
