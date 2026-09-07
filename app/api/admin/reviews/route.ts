import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sanitizeReviewInput } from '@/lib/reviews';
import { revalidateReviewPages } from './revalidate';
import { normalizeReviewOrder } from './order';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const [{ data: reviews, error }, { data: tours }] = await Promise.all([
    supabase
      .from('reviews')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase
      .from('tours')
      .select('id, name, slug')
      .order('name', { ascending: true }),
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const toursById = new Map((tours ?? []).map(tour => [tour.id, tour]));

  return NextResponse.json({
    reviews: (reviews ?? []).map(review => ({
      ...review,
      tour: toursById.get(review.tour_id) ?? null,
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
    const input = sanitizeReviewInput(await request.json());

    if (input.row === undefined) {
      return NextResponse.json({ error: input.error }, { status: 400 });
    }

    const reviewInput = input.row;
    const supabase = getSupabaseAdmin();

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
      .insert({
        ...reviewInput,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await normalizeReviewOrder(supabase, review.id);
    revalidateReviewPages();

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create review' }, {
      status: 500,
    });
  }
}
