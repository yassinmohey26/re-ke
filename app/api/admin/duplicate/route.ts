import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

const TABLES = ['tours', 'destinations', 'blog_posts', 'faqs'] as const;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { table, id, locale } = await request.json();

    if (!TABLES.includes(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    if (!locale) {
      return NextResponse.json({ error: 'Missing locale' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: source, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !source) {
      return NextResponse.json({ error: 'Source row not found' }, { status: 404 });
    }

    const { data: existing } = await supabase
      .from('content_translations')
      .select('id')
      .eq('table_name', table)
      .eq('row_id', id)
      .eq('locale', locale)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        error: `Translation for locale "${locale}" already exists`,
      }, { status: 409 });
    }

    const { data: deTranslation } = await supabase
      .from('content_translations')
      .select('*')
      .eq('table_name', table)
      .eq('row_id', id)
      .eq('locale', 'de')
      .limit(1)
      .maybeSingle();

    if (!deTranslation) {
      return NextResponse.json({ error: 'No DE translation found to copy from' }, { status: 404 });
    }

    const newTr: Record<string, unknown> = {
      table_name: table,
      row_id: id,
      locale,
      name: deTranslation.name,
      short_description: deTranslation.short_description,
      description: deTranslation.description,
      category_label: deTranslation.category_label,
      highlights: deTranslation.highlights,
      included: deTranslation.included,
      not_included: deTranslation.not_included,
      itinerary: deTranslation.itinerary,
      faqs: deTranslation.faqs,
      // meeting_point and duration are NOT copied to translations —
      // they are rendered at runtime from tours.pickup_time_slots and tours.duration_hours.
      tagline: deTranslation.tagline,
      title: deTranslation.title,
      excerpt: deTranslation.excerpt,
      content: deTranslation.content,
      category: deTranslation.category,
      read_time: deTranslation.read_time,
      tags: deTranslation.tags,
      question: deTranslation.question,
      answer: deTranslation.answer,
      sort_order: deTranslation.sort_order,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('content_translations')
      .insert(newTr)
      .select()
      .single();

    if (insertError) {
      console.error('[duplicate] Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(inserted, { status: 201 });
  } catch (e) {
    console.error('[duplicate] Catch:', e);
    return NextResponse.json({ error: 'Duplicate failed' }, { status: 500 });
  }
}
