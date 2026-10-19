import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { saveReview } from '../save';
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
    .select('*, review_tours(tour_id)')
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
    return await saveReview(await request.json(), id);
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

  try {
    await normalizeReviewOrder(supabase);
  } catch (orderError) {
    // The review has already been deleted. A temporary ordering failure must
    // not turn that successful delete into a failed request for the admin UI.
    console.error('[reviews] Failed to normalize review order after delete:', orderError);
  }

  try {
    revalidateReviewPages();
  } catch (revalidationError) {
    // Revalidation is best-effort here; it must not mask a completed delete.
    console.error('[reviews] Failed to revalidate pages after delete:', revalidationError);
  }

  return NextResponse.json({ success: true });
}
