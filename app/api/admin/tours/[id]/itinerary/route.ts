import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

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
  const { data, error } = await supabase.from('tours').select('itinerary').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ itinerary: Array.isArray(data.itinerary) ? data.itinerary : [] });
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
    const itinerary = sanitizeItinerary(body.itinerary);

    // Only the itinerary column is written (plus updated_at, same as the general save).
    const { error } = await supabase
      .from('tours')
      .update({ itinerary, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Itinerary update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ itinerary });
  } catch (e) {
    console.error('Itinerary update catch:', e);
    return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 });
  }
}
