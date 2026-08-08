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

  return NextResponse.json({ ...tour, translations: trMap, rawDescription });

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

    const tourRow: Record<string, unknown> = {};

    if (body.slug !== undefined) tourRow.slug = body.slug;
    if (body.price !== undefined) tourRow.price = body.price ?? null;
    if (body.durationHours !== undefined) tourRow.duration_hours = body.durationHours;
    if (body.duration !== undefined) tourRow.duration = body.duration;
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
    if (body.itinerary !== undefined) tourRow.itinerary = sanitizeItinerary(body.itinerary);
    if (body.faqs !== undefined) tourRow.faqs = sanitizeFAQs(body.faqs);
    if (body.name !== undefined && locale === 'de') tourRow.name = body.name;
    // German‑locale specific fields
    if (body.shortDescription !== undefined && locale === 'de')
      tourRow.short_description = body.shortDescription;
    if (body.description !== undefined && locale === 'de')
      tourRow.description = body.description;
    if (body.categoryLabel !== undefined && locale === 'de')
      tourRow.category_label = body.categoryLabel;
    if (body.highlights !== undefined && locale === 'de')
      tourRow.highlights = body.highlights;
    if (body.included !== undefined && locale === 'de')
      tourRow.included = body.included;
    if (body.notIncluded !== undefined && locale === 'de')
      tourRow.not_included = body.notIncluded;
    // meeting_point is now a structural field owned by tours base table only.
    // Pickup time slots are stored in pickup_time_slots JSONB on tours.
    if (body.meetingPoint !== undefined) tourRow.meeting_point = body.meetingPoint;
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

    const hasTrFields = body.name !== undefined || body.shortDescription !== undefined || body.description !== undefined
      || body.categoryLabel !== undefined || body.highlights !== undefined || body.included !== undefined
      || body.notIncluded !== undefined || (body.faqs !== undefined && locale !== 'de') || body.deName !== undefined;

    if (hasTrFields) {
      const trRow: Record<string, unknown> = {
        table_name: 'tours',
        row_id: id,
        locale,
      };
      if (locale === 'de') {
        if (body.deName !== undefined) trRow.name = body.deName;
      } else if (body.name !== undefined) {
        trRow.name = body.name;
      }
      if (body.shortDescription !== undefined) trRow.short_description = body.shortDescription;
      if (body.description !== undefined) trRow.description = body.description;
      if (body.categoryLabel !== undefined) trRow.category_label = body.categoryLabel;
      if (body.highlights !== undefined) trRow.highlights = body.highlights;
      if (body.included !== undefined) trRow.included = body.included;
      if (body.notIncluded !== undefined) trRow.not_included = body.notIncluded;
      if (body.faqs !== undefined && locale !== 'de') trRow.faqs = body.faqs;
      // NOTE: duration and meeting_point are NOT written to content_translations.
      // duration is derived from tours.duration_hours at render time (formatDuration).
      // meeting_point is rendered from tours.pickup_time_slots + CT template at render time.

      const { error: trError } = await supabase
        .from('content_translations')
        .upsert(trRow, { onConflict: 'table_name,row_id,locale' });

      if (trError) {
        console.error('Tour translation upsert error:', trError);
        return NextResponse.json({ error: trError.message }, { status: 500 });
      }

      if (locale !== 'de') {
        const { data: deTr } = await supabase
          .from('content_translations')
          .select('description')
          .eq('table_name', 'tours')
          .eq('row_id', id)
          .eq('locale', 'de')
          .maybeSingle();

        if (deTr?.description) {
          const deStripped = deTr.description.replace(/<table[\s\S]*?class="tour-pricing-table"[\s\S]*?<\/table>/gi, '').trim();
          const newDesc = deStripped + '\n' + (body.description?.match(/<table[\s\S]*?class="tour-pricing-table"[\s\S]*?<\/table>/i)?.[0] ?? '');
          if (newDesc.trim()) {
            await supabase
              .from('content_translations')
              .update({ description: newDesc })
              .eq('table_name', 'tours')
              .eq('row_id', id)
              .eq('locale', 'de');
          }
        }
      }
    }

    const { data: tour } = await supabase.from('tours').select('*').eq('id', id).single();
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
