import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sanitizeReviewInput } from '@/lib/reviews';
import { revalidateReviewPages } from '../revalidate';
import { normalizeReviewOrder } from '../order';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: Context,
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  return NextResponse.json(review);
}

export async function PUT(
  request: NextRequest,
  { params }: Context,
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const input = sanitizeReviewInput(await request.json());

    if (input.row === undefined) {
      return NextResponse.json({ error: input.error }, { status: 400 });
    }

    const reviewInput = input.row;
    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const { data: tour } = await supabase
      .from('tours')
      .select('id')
      .eq('id', reviewInput.tour_id)
      .maybeSingle();

    if (!tour) {
      return NextResponse.json({ error: 'Selected tour was not found' }, {
        status: 404,
      });
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .update(reviewInput)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await normalizeReviewOrder(supabase, review.id);
    revalidateReviewPages();

    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: 'Failed to update review' }, {
      status: 500,
    });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: Context,
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await normalizeReviewOrder(supabase);
  revalidateReviewPages();

  return NextResponse.json({ success: true });
}
