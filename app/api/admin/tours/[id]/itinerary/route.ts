import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

const SUPPORTED_LOCALES = ['de', 'en', 'fr', 'hu', 'ru', 'ar'];

interface ItineraryItem {
  title: string;
  content: string;
}

function sanitizeItinerary(value: unknown): ItineraryItem[] {
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

function parseItin(val: unknown): ItineraryItem[] {
  if (Array.isArray(val)) return val as ItineraryItem[];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed as ItineraryItem[];
    } catch {}
  }
  return [];
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

  // German is the master → itinerary lives in the base `tours` table.
  if (locale === 'de') {
    const { data, error } = await supabase.from('tours').select('itinerary').eq('id', id).single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      locale,
      source: 'tours.itinerary',
    });
  }

  // Non-German → read ONLY this locale's translation row.
  // Existing localized itineraries were historically stored as JSON in the
  // `content` TEXT column; new saves use the `itinerary` JSONB column.
  const { data: tr } = await supabase
    .from('content_translations')
    .select('itinerary, content')
    .eq('table_name', 'tours')
    .eq('row_id', id)
    .eq('locale', locale)
    .limit(1)
    .maybeSingle();

  let itinerary = parseItin(tr?.itinerary);
  let source = 'content_translations.itinerary';
  if (itinerary.length === 0 && tr?.content) {
    itinerary = parseItin(tr.content);
    source = 'content_translations.content';
  }

  return NextResponse.json({ itinerary, locale, source });
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
    const locale = body.locale || 'de';
    if (!SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
    }
    const itinerary = sanitizeItinerary(body.itinerary);
    const supabase = getSupabaseAdmin();

    if (locale === 'de') {
      // German master → base `tours` table.
      const { error } = await supabase
        .from('tours')
        .update({ itinerary, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) {
        console.error('Itinerary update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ itinerary, locale, stored: 'base' });
    }

    // Non-German → upsert ONLY this locale's translation row. Never touches
    const { error: trError } = await supabase
      .from('content_translations')
      .upsert(
        { table_name: 'tours', row_id: id, locale, itinerary },
        { onConflict: 'table_name,row_id,locale' },
      );

    if (trError) {
      console.error('Itinerary translation upsert error:', trError);
      return NextResponse.json({ error: trError.message }, { status: 500 });
    }
    return NextResponse.json({ itinerary, locale, stored: 'translation' });
  } catch (e) {
    console.error('Itinerary update catch:', e);
    return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 });
  }
}
