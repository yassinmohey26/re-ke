import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckoutSession } from '@/lib/stripe';

const checkoutSchema = z.object({
  tourSlug: z.string().min(1),
  tourName: z.string().min(1),
  firstName: z.string().min(2).max(60).trim(),
  lastName: z.string().min(2).max(60).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  phone: z.string().min(7).max(30),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(20),
  message: z.string().max(2000).optional().or(z.literal('')),
  totalPrice: z.number().positive(),
  paymentOption: z.enum(['full', 'deposit']).optional().default('full'),
  extrasJson: z.string().optional(),
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Parse extras from JSON string if provided
    let extras: { id: string; name: string; price: number }[] = [];
    if (body.extrasJson) {
      try {
        extras = JSON.parse(body.extrasJson);
      } catch {
        extras = [];
      }
    }

    const parsed = checkoutSchema.safeParse({
      ...body,
      extras: undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.totalPrice <= 0) {
      return NextResponse.json(
        { error: 'Total price must be greater than zero' },
        { status: 400 }
      );
    }

    const result = await createCheckoutSession({
      tourSlug: data.tourSlug,
      tourName: data.tourName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      date: data.date,
      guests: data.guests,
      message: typeof data.message === 'string' ? data.message : undefined,
      totalPrice: data.totalPrice,
      paymentOption: data.paymentOption,
      extras,
      locale: data.locale,
    });

    return NextResponse.json({
      url: result.url,
      sessionId: result.sessionId,
      bookingId: result.bookingId,
    });
  } catch (error) {
    console.error('[CHECKOUT] Stripe session creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
