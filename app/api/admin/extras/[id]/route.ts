// Place at: app/api/admin/extras/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

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

    const row: Record<string, unknown> = {
      name: body.name,
      description: body.description || '',
      price: body.price ?? 0,
      active: body.active !== false,
      sort_order: body.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tour_extras')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    console.error('Extra update catch:', e);
    return NextResponse.json({ error: 'Failed to update extra' }, { status: 500 });
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
  const { error } = await supabase.from('tour_extras').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
