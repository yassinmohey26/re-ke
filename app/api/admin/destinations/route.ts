import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: dest, error: destError } = await supabase
      .from('destinations')
      .insert({
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: body.image || '',
      })
      .select()
      .single();

    if (destError) return NextResponse.json({ error: destError.message }, { status: 500 });

    const { error: trError } = await supabase
      .from('content_translations')
      .insert({
        table_name: 'destinations',
        row_id: dest.id,
        locale: 'de',
        name: body.name || '',
        tagline: body.tagline || '',
        description: body.description || '',
      });

    if (trError) console.error('Destination translation insert error:', trError);

    return NextResponse.json(dest, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}
