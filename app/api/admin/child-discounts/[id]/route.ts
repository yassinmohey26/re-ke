import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sanitizeChildDiscountInput } from '@/lib/child-discounts';

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
    const input = sanitizeChildDiscountInput(body);
    if (!input) return NextResponse.json({ error: 'Invalid tier data' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const row = {
      age_from: input.age_from,
      age_to: input.age_to,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      sort_order: input.sort_order,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tour_child_discounts')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    console.error('Child discount update catch:', e);
    return NextResponse.json({ error: 'Failed to update child discount tier' }, { status: 500 });
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
  const { error } = await supabase.from('tour_child_discounts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
