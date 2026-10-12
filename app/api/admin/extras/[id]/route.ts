// Place at: app/api/admin/extras/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isExtraLocale, updateExtraTexts } from '@/lib/tour-extras';
import { revalidateTourPages } from '../../tours/revalidate';

export async function PUT(
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
    const locale = body.locale ?? 'de';
    if (!isExtraLocale(locale)) return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    if (!name) return NextResponse.json({ error: 'Extra name is required' }, { status: 400 });
    const { data: existing, error: loadError } = await supabase
      .from('tour_extras').select('id,name,description,updated_at').eq('id', id).single();
    if (loadError || !existing) return NextResponse.json({ error: 'Extra not found' }, { status: 404 });

    const row: Record<string, unknown> = {
      description: updateExtraTexts(existing, locale, { name, description }),
      updated_at: new Date().toISOString(),
    };
    if (locale === 'de') {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json({ error: 'Invalid extra price' }, { status: 400 });
      }
      row.name = name;
      row.price = price;
      row.active = body.active !== false;
      row.sort_order = body.sortOrder ?? 0;
    }

    let updateQuery = supabase.from('tour_extras').update(row).eq('id', id);
    updateQuery = existing.updated_at
      ? updateQuery.eq('updated_at', existing.updated_at)
      : updateQuery.is('updated_at', null);
    const { data, error } = await updateQuery.select().maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Extra changed while saving. Reload and try again.' }, { status: 409 });
    revalidateTourPages();
    return NextResponse.json(data);
  } catch (e) {
    console.error('Extra update catch:', e);
    return NextResponse.json({ error: 'Failed to update extra' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('tour_extras').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateTourPages();
  return NextResponse.json({ success: true });
}
