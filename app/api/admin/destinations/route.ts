import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { revalidateDestinationPages } from './revalidate';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
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

    if (typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Destination name is required' }, { status: 400 });
    }
    const name = body.name.trim();

    // Homepage featured validation
    const featured = body.featured ?? false;
    let displayOrder = body.display_order ?? null;
    if (featured === false) {
      displayOrder = null;
    } else if (displayOrder !== null && displayOrder !== undefined) {
      const parsed = Number(displayOrder);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
        return NextResponse.json({ error: 'display_order must be an integer between 1 and 5' }, { status: 400 });
      }
      displayOrder = parsed;
    }

    // Prevent duplicate featured positions (server-side check)
    if (featured && displayOrder !== null) {
      const { data: conflict } = await supabase
        .from('destinations')
        .select('id')
        .eq('featured', true)
        .eq('display_order', displayOrder)
        .limit(1);
      if (conflict && conflict.length > 0) {
        return NextResponse.json({ error: `Homepage position ${displayOrder} is already used by another featured destination` }, { status: 409 });
      }
    }

    const slug = typeof body.slug === 'string' && body.slug.trim()
      ? body.slug.trim()
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!slug) {
      return NextResponse.json({ error: 'Destination slug is required' }, { status: 400 });
    }

    const { data: dest, error: destError } = await supabase
      .from('destinations')
      .insert({
        name,
        slug,
        tagline: body.tagline || '',
        description: body.description || '',
        image: body.image || '',
        featured,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (destError) return NextResponse.json({ error: destError.message }, { status: 500 });

    const { error: trError } = await supabase
      .from('content_translations')
      .insert({
        table_name: 'destinations',
        row_id: dest.id,
        locale: 'de',
        name,
        tagline: body.tagline || '',
        description: body.description || '',
      });

    if (trError) console.error('Destination translation insert error:', trError);

    revalidateDestinationPages();

    return NextResponse.json(dest, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}
