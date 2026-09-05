import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckoutSession } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  calculateDepositAmount,
  STRIPE_MINIMUM_CENTS,
  SUPPORTED_CURRENCIES,
  toStripeCents,
} from '@/lib/participant-pricing';
import { CheckoutPricingError, resolveServerCheckout } from '@/lib/checkout-pricing';
import { calculateTransferSurcharge, TransferPricingError } from '@/lib/transfer-pricing';

// The browser only tells us WHAT is booked: tour slug, participant counts,
// selected extra IDs, and the hotel region slug. Every name, price, surcharge,
// quantity check, and total is loaded or derived from Supabase/shared rules on
// the server. Client-sent totalPrice, unit prices, extra names/prices, and
// guest counts are never trusted.
const checkoutSchema = z.object({
  tourSlug: z.string().min(1).max(160),
  adults: z.number().int().min(0).max(20),
  children: z.number().int().min(0).max(20),
  infants: z.number().int().min(0).max(20),
  extraIds: z.array(z.string().min(1).max(64)).max(20).optional().default([]),
  hotelRegion: z.string().max(40).optional(),
  paymentOption: z.enum(['full', 'deposit']).optional().default('full'),
  firstName: z.string().min(2).max(60).trim(),
  lastName: z.string().min(2).max(60).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  phone: z.string().min(7).max(30),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  message: z.string().max(2000).optional().or(z.literal('')),
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = checkoutSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const supabase = getSupabaseAdmin();

    // 1. Load the active tour from the database — never from the request body.
    const { data: tour } = await supabase
      .from('tours')
      .select('id,name,price,max_guests')
      .eq('slug', data.tourSlug)
      .eq('active', true)
      .single();
    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 400 });
    }

    // 2. Load structured participant prices (legacy tour.price fallback is
    //    applied inside resolveServerCheckout) and only the ACTIVE extras
    //    that belong to this exact tour.
    const [{ data: participantRows }, { data: extraRows }] = await Promise.all([
      supabase.from('tour_participant_prices').select('*').eq('tour_id', tour.id).eq('is_active', true),
      supabase.from('tour_extras').select('id,name,price').eq('tour_id', tour.id).eq('active', true),
    ]);

    // 3. Recalculate everything on the server: quantities, participant
    //    prices, approved extras, hotel-region transfer surcharge, and the
    //    final total (participants + extras + transfer).
    let server;
    try {
      server = resolveServerCheckout({
        tour,
        participantRows: participantRows ?? [],
        quantities: { adult: data.adults, child: data.children, infant: data.infants },
        requestedExtraIds: data.extraIds,
        approvedExtras: extraRows ?? [],
      });
    } catch (error) {
      if (error instanceof CheckoutPricingError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }

    // The surcharge derives purely from the region slug and the
    // server-validated quantities; an unknown region is rejected.
    let transfer;
    try {
      transfer = calculateTransferSurcharge(data.hotelRegion, {
        adult: data.adults,
        child: data.children,
        infant: data.infants,
      });
    } catch (error) {
      if (error instanceof TransferPricingError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }

    const serverTotal = server.calculation.subtotal + (transfer?.subtotal ?? 0);
    if (serverTotal <= 0) {
      return NextResponse.json(
        { error: 'Total price must be greater than zero' },
        { status: 400 }
      );
    }
    if (!SUPPORTED_CURRENCIES.includes(server.calculation.currency)) {
      return NextResponse.json(
        { error: `Unsupported currency: ${server.calculation.currency}` },
        { status: 400 }
      );
    }
    const amountCents = data.paymentOption === 'deposit'
      ? toStripeCents(calculateDepositAmount(serverTotal))
      : toStripeCents(serverTotal);
    if (amountCents < STRIPE_MINIMUM_CENTS) {
      return NextResponse.json(
        { error: 'Total is below the minimum chargeable amount' },
        { status: 400 }
      );
    }

    // 4. Snapshot the complete server-calculated breakdown (participants,
    //    extras, transfer surcharge, quantities, deposit) so the booking is
    //    immune to later price changes.
    const priceSnapshot = {
      ...server.calculation,
      transfer: transfer,
      transferSubtotal: transfer?.subtotal ?? 0,
      quantities: { adult: data.adults, child: data.children, infant: data.infants },
      locale: data.locale ?? 'de',
      legacyFallback: server.legacyFallback,
      depositPercent: 0.3,
      depositAmount: calculateDepositAmount(serverTotal),
    };

    // 5. Charge only the server-calculated final total. createCheckoutSession
    //    derives the Stripe amount (full or 30% deposit) from this number.
    const result = await createCheckoutSession({
      tourSlug: data.tourSlug,
      tourName: tour.name,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      date: data.date,
      guests: server.guests,
      message: typeof data.message === 'string' ? data.message : undefined,
      totalPrice: serverTotal,
      paymentOption: data.paymentOption,
      extras: server.calculation.extras,
      priceSnapshot,
      transferSurcharge: transfer?.subtotal ?? 0,
      hotelRegion: data.hotelRegion,
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
