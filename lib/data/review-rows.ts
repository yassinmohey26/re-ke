import type { SupabaseClient } from '@supabase/supabase-js';

// Read compatibility allows existing reviews to remain visible during rollout.
// Saving the new types always requires migration 013; there is no legacy write path.
export async function loadReviewRows(
  db: SupabaseClient,
  options: { published?: boolean; featured?: boolean } = {},
): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = [];
  let legacy = false;
  const batchSize = 500;
  for (let offset = 0; ; offset += batchSize) {
    let query = db.from('reviews')
      .select(legacy ? '*' : '*, review_tours(tour_id)')
      .order('sort_order', { ascending: true })
      .order('travel_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(offset, offset + batchSize - 1);
    if (options.published) query = query.eq('is_published', true);
    if (options.featured) query = query.eq('featured', true);
    const { data, error } = await query;
    if (error) {
      if (!legacy && offset === 0 && error.code === 'PGRST200') {
        legacy = true;
        offset -= batchSize;
        continue;
      }
      throw new Error(`Failed to load reviews: ${error.message}`);
    }
    rows.push(...(data ?? []) as unknown as Record<string, unknown>[]);
    if (!data || data.length < batchSize) return rows;
  }
}
