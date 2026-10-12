// Place at: app/api/admin/tours/[id]/extras/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getExtraText, isExtraLocale, updateExtraTexts } from '@/lib/tour-extras';
import { revalidateTourPages } from '../../revalidate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const locale = request.nextUrl.searchParams.get('locale') ?? 'de';
  if (!isExtraLocale(locale)) return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('tour_extras')
    .select('*')
    .eq('tour_id', id)
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(row => {
    const text = getExtraText(row, locale);
    return { ...row, name: text?.name ?? '', description: text?.description ?? '', hasTranslation: text !== null };
  }));
}

export async function POST(
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
    if ((body.locale ?? 'de') !== 'de') {
      return NextResponse.json({ error: 'Create extras in German first' }, { status: 400 });
    }
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const price = Number(body.price);
    if (!name || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: 'A name and valid price are required' }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();

    const row = {
      tour_id: id,
      name,
      description: updateExtraTexts({ name, description: '' }, 'de', { name, description }),
      price,
      active: body.active !== false,
      sort_order: body.sortOrder ?? 0,
    };

    const { data, error } = await supabase
      .from('tour_extras')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Extra create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateTourPages();
    return NextResponse.json(data);
  } catch (e) {
    console.error('Extra create catch:', e);
    return NextResponse.json({ error: 'Failed to create extra' }, { status: 500 });
  }
}
