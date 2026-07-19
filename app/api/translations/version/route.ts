import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const db = getSupabaseAdmin();

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data } = await db
    .from('ui_translations_version')
    .select('version')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({ version: data?.version ?? 0 });
}
