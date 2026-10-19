import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sanitizeReviewInput } from '@/lib/reviews';
import { revalidateReviewPages } from './revalidate';

export async function saveReview(payload: unknown, id: string | null) {
  const input = sanitizeReviewInput(payload);
  if (input.row === undefined) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin().rpc('save_review_with_tours', {
    p_id: id,
    p_review: input.row,
    p_tour_ids: input.tourIds,
  });

  if (error) {
    const schemaMissing = error.code === 'PGRST202';
    const invalidInput = ['P0001', '23503', '23514', '23502', '22P02', '22007', '22008'].includes(error.code);
    return NextResponse.json({
      error: schemaMissing
        ? 'Review setup is pending. Apply the approved reviews migration before saving.'
        : error.message,
    }, { status: schemaMissing ? 503 : error.code === 'P0002' ? 404 : invalidInput ? 400 : 500 });
  }

  // A cache failure must not make a committed save look unsuccessful.
  try {
    revalidateReviewPages();
  } catch (error) {
    console.error('[reviews] Failed to revalidate after save:', error);
  }
  return NextResponse.json(data, { status: id ? 200 : 201 });
}
