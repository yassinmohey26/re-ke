import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const locale = new URL(request.url).searchParams.get('locale') || 'de';
  const db = getSupabaseAdmin();
  const [{ data: tours, error: toursError }, { data: translations, error: translationsError }, { data: selected, error: selectedError }] = await Promise.all([
    db.from('tours').select('id, name, slug, active, destination').eq('active', true).order('name'),
    db.from('content_translations').select('row_id, name').eq('table_name', 'tours').eq('locale', locale),
    db.from('destination_tours').select('tour_id').eq('destination_id', id),
  ]);
  if (toursError || translationsError || selectedError) return NextResponse.json({ error: toursError?.message || translationsError?.message || selectedError?.message }, { status: 500 });
  const names = new Map((translations ?? []).map(row => [row.row_id, row.name]));
  const localizedTours = (tours ?? []).map(tour => ({ ...tour, name: names.get(tour.id) || tour.name }));
  return NextResponse.json({ tours: localizedTours, selectedTourIds: (selected ?? []).map(row => row.tour_id) });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const tourIds = Array.isArray(body.tourIds) ? body.tourIds.filter((value: unknown): value is string => typeof value === 'string') : [];
  const db = getSupabaseAdmin();
  const { error: deleteError } = await db.from('destination_tours').delete().eq('destination_id', id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  if (tourIds.length > 0) {
    const { error } = await db.from('destination_tours').insert(tourIds.map((tour_id: string) => ({ destination_id: id, tour_id })));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ selectedTourIds: tourIds });
}
