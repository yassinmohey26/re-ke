import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

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

    const { data: faq, error: faqError } = await supabase
      .from('faqs')
      .update({
        question: body.question,
        answer: body.answer,
        sort_order: body.sort_order,
      })
      .eq('id', id)
      .select()
      .single();

    if (faqError) return NextResponse.json({ error: faqError.message }, { status: 500 });

    const { error: trError } = await supabase
      .from('content_translations')
      .upsert({
        table_name: 'faqs',
        row_id: Number(id),
        locale,
        question: body.question,
        answer: body.answer,
      }, { onConflict: 'table_name,row_id,locale' });

    if (trError) console.error('FAQ translation upsert error:', trError);

    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
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

  await supabase.from('content_translations').delete().eq('table_name', 'faqs').eq('row_id', id);
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
