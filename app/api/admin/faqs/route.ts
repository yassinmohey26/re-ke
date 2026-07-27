import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('faqs').select('*').order('sort_order');
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

    const { data: faq, error: faqError } = await supabase
      .from('faqs')
      .insert({
        question: body.question,
        answer: body.answer,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();

    if (faqError) return NextResponse.json({ error: faqError.message }, { status: 500 });

    const { error: trError } = await supabase
      .from('content_translations')
      .insert({
        table_name: 'faqs',
        row_id: faq.id,
        locale: 'de',
        question: body.question,
        answer: body.answer,
      });

    if (trError) console.error('FAQ translation insert error:', trError);

    return NextResponse.json(faq, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
