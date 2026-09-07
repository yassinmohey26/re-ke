import type { SupabaseClient } from '@supabase/supabase-js';

interface OrderedReview {
  id: string;
  sort_order: number;
  created_at: string;
}

export async function normalizeReviewOrder(
  supabase: SupabaseClient,
  preferredReviewId?: string,
) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, sort_order, created_at');

  if (error) throw new Error(error.message);

  const reviews = (data ?? []) as OrderedReview[];
  const preferred = preferredReviewId
    ? reviews.find(review => review.id === preferredReviewId)
    : undefined;

  const ordered = reviews
    .filter(review => review.id !== preferredReviewId)
    .sort((a, b) => {
      const aOrder = a.sort_order > 0
        ? a.sort_order
        : Number.MAX_SAFE_INTEGER;
      const bOrder = b.sort_order > 0
        ? b.sort_order
        : Number.MAX_SAFE_INTEGER;

      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.created_at.localeCompare(b.created_at);
    });

  if (preferred) {
    const requestedPosition = Math.max(1, preferred.sort_order);
    const insertionIndex = Math.min(
      requestedPosition - 1,
      ordered.length,
    );

    ordered.splice(insertionIndex, 0, preferred);
  }

  for (let index = 0; index < ordered.length; index += 1) {
    const position = index + 1;
    const review = ordered[index];

    if (review.sort_order === position) continue;

    const { error: updateError } = await supabase
      .from('reviews')
      .update({
        sort_order: position,
        updated_at: new Date().toISOString(),
      })
      .eq('id', review.id);

    if (updateError) throw new Error(updateError.message);
  }
}
