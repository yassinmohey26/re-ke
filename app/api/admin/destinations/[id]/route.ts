import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data: dest, error } = await supabase.from('destinations').select('*').eq('id', id).single();
  if (error || !dest) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: translations } = await supabase
    .from('content_translations')
    .select('*')
    .eq('table_name', 'destinations')
    .eq('row_id', id);

  const trMap: Record<string, any> = {};
  for (const tr of translations ?? []) {
    trMap[tr.locale] = tr;
  }

  return NextResponse.json({ ...dest, translations: trMap });
}

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
    const locale = body.locale || 'de';

    const { data: dest, error: destError } = await supabase
      .from('destinations')
      .update({
        slug: body.slug,
        image: body.image || '',
      })
      .eq('id', id)
      .select()
      .single();

    if (destError) return NextResponse.json({ error: destError.message }, { status: 500 });

    const { error: trError } = await supabase
      .from('content_translations')
      .upsert({
        table_name: 'destinations',
        row_id: id,
        locale,
        name: body.name || '',
        tagline: body.tagline || '',
        description: body.description || '',
      }, { onConflict: 'table_name,row_id,locale' });

    if (trError) console.error('Destination translation upsert error:', trError);

    return NextResponse.json(dest);
  } catch {
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
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

  await supabase.from('content_translations').delete().eq('table_name', 'destinations').eq('row_id', id);
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
