import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

// ── Stripe Client ──────────────────────────────────────────────────
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-06-24.dahlia',
  typescript: true,
});

// ── Types ──────────────────────────────────────────────────────────
export interface CheckoutBookingData {
  tourSlug: string;
  tourName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  message?: string;
  totalPrice: number;
  paymentOption?: 'full' | 'deposit';
  extras?: { id: string; name: string; price: number }[];
  locale?: string;
}

export interface StripeCheckoutResult {
  sessionId: string;
  url: string;
  bookingId: string;
}

// ── Helper: Get Site URL ───────────────────────────────────────────
function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
}

// ── Create Checkout Session ────────────────────────────────────────
export async function createCheckoutSession(
  data: CheckoutBookingData
): Promise<StripeCheckoutResult> {
  const supabase = getSupabaseAdmin();

  // 1. Create booking in Supabase (PENDING)
  const { data: booking, error: bookingError } = await supabase
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
      total_price: data.totalPrice,
      payment_option: data.paymentOption || 'full',
      extras: data.extras ?? [],
    })
    .select('id')
    .single();

  if (bookingError || !booking) {
    console.error('[STRIPE] Failed to create booking:', bookingError);
    throw new Error('Failed to create booking');
  }

  // 2. Calculate amount based on payment option
  const depositPercent = 0.3; // 30% deposit
  const amount = data.paymentOption === 'deposit'
    ? Math.round(data.totalPrice * depositPercent * 100)
    : Math.round(data.totalPrice * 100);

  // 3. Create Stripe Checkout Session
  const siteUrl = getSiteUrl();
  const locale = data.locale || 'de';
  const extrasDescription = data.extras?.length
    ? ` + ${data.extras.map((e) => e.name).join(', ')}`
    : '';

  const paymentOptionLabel = data.paymentOption === 'deposit' 
    ? ' (30% Anzahlung)' 
    : '';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: data.email,
    client_reference_id: booking.id,
    metadata: {
      bookingId: booking.id,
      tourSlug: data.tourSlug,
      tourName: data.tourName,
      guests: String(data.guests),
      date: data.date,
      paymentOption: data.paymentOption || 'full',
    },
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${data.tourName}${extrasDescription}${paymentOptionLabel}`,
            description: `${data.date} · ${data.guests} Guest${data.guests > 1 ? 's' : ''}`,
            metadata: {
              tourSlug: data.tourSlug,
              bookingId: booking.id,
            },
          },
          unit_amount: amount, // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/${locale}/booking/erfolgreich?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${locale}/booking/abgebrochen?session_id={CHECKOUT_SESSION_ID}`,
    shipping_address_collection: undefined,
    phone_number_collection: { enabled: false },
    custom_text: {
      submit: {
        message: 'Hurghada Reiseplaner — Your Egypt Adventure Starts Here',
      },
    },
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session URL');
  }

  return {
    sessionId: session.id,
    url: session.url,
    bookingId: booking.id,
  };
}

// ── Retrieve Session (used by success page to verify payment) ──────
export async function retrieveSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'customer'],
  });
}

// ── Confirm Booking (via webhook) ──────────────────────────────────
export async function confirmBookingPayment(
  bookingId: string,
  stripePaymentId: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'CONFIRMED',
      stripe_payment_id: stripePaymentId,
    })
    .eq('id', bookingId);

  if (error) {
    console.error(`[STRIPE] Failed to confirm booking #${bookingId}:`, error);
    throw error;
  }

  console.log(`[STRIPE] Booking #${bookingId} confirmed, payment: ${stripePaymentId}`);
}

// ── Mark Booking Payment Failed ────────────────────────────────────
export async function markBookingPaymentFailed(
  bookingId: string,
  reason?: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'PAYMENT_FAILED',
      payment_error: reason || 'Payment failed',
    })
    .eq('id', bookingId);

  if (error) {
    console.error(`[STRIPE] Failed to update booking #${bookingId} payment status:`, error);
  }
}

// ── Refund Booking ─────────────────────────────────────────────────
export async function markBookingRefunded(
  stripePaymentId: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'REFUNDED' })
    .eq('stripe_payment_id', stripePaymentId);

  if (error) {
    console.error(`[STRIPE] Failed to mark refund for payment ${stripePaymentId}:`, error);
  }
}
