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

  const destSlugs = (data ?? []).map((d: any) => d.slug);
  const { data: translations } = await supabase
    .from('destination_translations')
    .select('*')
    .in('destination_slug', destSlugs);

  const transMap = new Map<string, any[]>();
  for (const tr of translations ?? []) {
    if (!transMap.has(tr.destination_slug)) transMap.set(tr.destination_slug, []);
    transMap.get(tr.destination_slug)!.push(tr);
  }

  const destinations = (data ?? []).map((d: any) => ({
    ...d,
    translations: transMap.get(d.slug) ?? [],
  }));

  return NextResponse.json(destinations);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('destinations')
      .insert({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: body.tagline || '',
        description: body.description || '',
        image: body.image || '',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (body.translations && typeof body.translations === 'object') {
      const transRows = Object.entries(body.translations)
        .filter(([locale]) => locale !== 'de')
        .map(([locale, tr]: [string, any]) => ({
          destination_slug: body.slug || data.slug,
          locale,
          tagline: tr.tagline || '',
          description: tr.description || '',
        }));
      if (transRows.length > 0) {
        await supabase.from('destination_translations').upsert(transRows, { onConflict: 'destination_slug,locale' });
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}
