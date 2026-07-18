import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const checkoutSchema = z.object({
  tourSlug: z.string().min(1),
  tourName: z.string().min(1),
  firstName: z.string().min(2).max(60).trim(),
  lastName: z.string().min(2).max(60).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  phone: z.string().min(7).max(30),
  date: z.string().refine((d) => {
    const date = new Date(d);
    return !isNaN(date.getTime()) && date > new Date();
  }),
  guests: z.number().int().min(1).max(20),
  message: z.string().max(2000).optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = getSupabaseAdmin();

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        tour_slug: data.tourSlug,
        tour_name: data.tourName,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        date: data.date,
        guests: data.guests,
        status: 'PENDING',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Buchung fehlgeschlagen. Bitte erneut versuchen.' },
      { status: 500 }
    );
  }
}
