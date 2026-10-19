import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { reviewTourIds, reviewType } from '@/lib/reviews';
import { loadReviewRows } from '@/lib/data/review-rows';
import { saveReview } from './save';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const [reviewResult, tourResult] = await Promise.allSettled([
    loadReviewRows(supabase),
    supabase.from('tours').select('id, name, slug').order('name', { ascending: true }),
  ]);
  if (reviewResult.status === 'rejected' || tourResult.status === 'rejected' || tourResult.value.error) {
    return NextResponse.json({ error: 'Failed to load reviews and tours' }, { status: 500 });
  }
  const reviews = reviewResult.value;
  const tours = tourResult.value.data;

  const toursById = new Map((tours ?? []).map(tour => [tour.id, tour]));

  return NextResponse.json({
    reviews: (reviews ?? []).map(review => ({
      ...review,
      review_type: reviewType(review.review_type),
      tour_ids: reviewTourIds(review),
      tours: reviewTourIds(review).flatMap(id => {
        const tour = toursById.get(id);
        return tour ? [tour] : [];
      }),
    })),
    tours: tours ?? [],
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    return await saveReview(await request.json(), null);
  } catch {
    return NextResponse.json({ error: 'Failed to create review' }, {
      status: 500,
    });
  }
}
