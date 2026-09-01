import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { revalidateDestinationPages } from '../revalidate';

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.destinationIds) || body.destinationIds.some((id: unknown) => typeof id !== 'string')) {
      return NextResponse.json({ error: 'destinationIds must be an array of strings' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: existing, error: existingError } = await supabase.from('destinations').select('id');
    if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });

    const existingIds = new Set((existing ?? []).map(destination => destination.id));
    if (
      body.destinationIds.length !== existingIds.size ||
      new Set(body.destinationIds).size !== body.destinationIds.length ||
      body.destinationIds.some((id: string) => !existingIds.has(id))
    ) {
      return NextResponse.json({ error: 'destinationIds must contain every destination exactly once' }, { status: 400 });
    }

    for (const [index, id] of body.destinationIds.entries()) {
      const { error } = await supabase.from('destinations').update({ display_order: index + 1 }).eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateDestinationPages();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to reorder destinations' }, { status: 500 });
  }
}
