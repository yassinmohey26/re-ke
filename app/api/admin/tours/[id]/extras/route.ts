// Place at: app/api/admin/tours/[id]/extras/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

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
  const { data, error } = await supabase
    .from('tour_extras')
    .select('*')
    .eq('tour_id', id)
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
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
    const supabase = getSupabaseAdmin();

    const row = {
      tour_id: id,
      name: body.name,
      description: body.description || '',
      price: body.price ?? 0,
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

    return NextResponse.json(data);
  } catch (e) {
    console.error('Extra create catch:', e);
    return NextResponse.json({ error: 'Failed to create extra' }, { status: 500 });
  }
}
