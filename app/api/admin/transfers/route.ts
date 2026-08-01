import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('airport_transfers')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = await request.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('airport_transfers')
    .insert({
      destination: body.destination,
      car_price: Number(body.car_price) || 0,
      minibus_price: Number(body.minibus_price) || 0,
      sort_order: Number(body.sort_order) || 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('airport_transfers')
    .update({
      destination: body.destination,
      car_price: Number(body.car_price) || 0,
      minibus_price: Number(body.minibus_price) || 0,
      sort_order: Number(body.sort_order) || 0,
    })
    .eq('id', body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return unauthorized();

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('airport_transfers')
    .delete()
    .eq('id', body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
