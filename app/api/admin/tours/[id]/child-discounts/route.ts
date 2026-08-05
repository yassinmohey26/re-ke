import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sanitizeChildDiscountInput, type ChildDiscountInput } from '@/lib/child-discounts';

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
    .from('tour_child_discounts')
    .select('*')
    .eq('tour_id', id)
    .order('sort_order', { ascending: true })
    .order('age_from', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
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

    if (Array.isArray(body.items)) {
      const rows = (body.items as Record<string, unknown>[])
        .map((item) => sanitizeChildDiscountInput(item))
        .filter((input): input is ChildDiscountInput => input !== null)
        .map((input, index) => ({
          tour_id: id,
          age_from: input.age_from,
          age_to: input.age_to,
          discount_type: input.discount_type,
          discount_value: input.discount_value,
          sort_order: input.sort_order ?? index,
        }));

      if (rows.length === 0) {
        return NextResponse.json({ error: 'No valid tiers' }, { status: 400 });
      }

      const { data, error } = await supabase.from('tour_child_discounts').insert(rows).select();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data, { status: 201 });
    }

    const input = sanitizeChildDiscountInput(body);
    if (!input) return NextResponse.json({ error: 'Invalid tier data' }, { status: 400 });

    const row = {
      tour_id: id,
      age_from: input.age_from,
      age_to: input.age_to,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      sort_order: input.sort_order,
    };

    const { data, error } = await supabase.from('tour_child_discounts').insert(row).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error('Child discount create catch:', e);
    return NextResponse.json({ error: 'Failed to create child discount tier' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id: tourId } = await params;
  try {
    const body = await request.json();
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Expected items array' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    await supabase.from('tour_child_discounts').delete().eq('tour_id', tourId);

    const rows = body.items
      .map((item: Record<string, unknown>, index: number) => {
        const input = sanitizeChildDiscountInput(item);
        if (!input) return null;
        return {
          tour_id: tourId,
          age_from: input.age_from,
          age_to: input.age_to,
          discount_type: input.discount_type,
          discount_value: input.discount_value,
          sort_order: input.sort_order ?? index,
        };
      })
      .filter(Boolean);

    if (rows.length === 0) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase.from('tour_child_discounts').insert(rows).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    console.error('Child discount replace catch:', e);
    return NextResponse.json({ error: 'Failed to replace child discount tiers' }, { status: 500 });
  }
}
