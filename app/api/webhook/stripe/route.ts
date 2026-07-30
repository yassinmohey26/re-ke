import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, confirmBookingPayment, markBookingPaymentFailed, markBookingRefunded } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

async function sendConfirmationEmail(bookingId: string) {
  if (!process.env.RESEND_API_KEY) return;

  const supabase = getSupabaseAdmin();
  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (!booking) return;

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const dateStr = new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const customerHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff">
    <div style="background:linear-gradient(135deg,#0057b8 0%,#003d82 100%);padding:32px 24px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700">Hurghada Reiseplaner</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Payment Confirmed</p>
    </div>
    <div style="padding:32px 24px">
      <p style="color:#374151;font-size:15px">Dear ${booking.first_name} ${booking.last_name},</p>
      <h2 style="color:#111827;font-size:20px">Your booking is confirmed!</h2>
      <p style="color:#6b7280;font-size:14px">Your payment for <strong>${booking.tour_name}</strong> has been received successfully.</p>
      <table style="border-collapse:collapse;width:100%;margin:20px 0">
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Tour</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;color:#374151">${booking.tour_name}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Date</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;color:#374151">${dateStr}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Guests</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;color:#374151">${booking.guests}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Total Paid</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;color:#374151;font-weight:700;font-size:18px">€${booking.total_price}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Booking ID</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;color:#374151">#${booking.id}</td></tr>
      </table>
      <p style="color:#6b7280;font-size:13px">We will contact you within 24 hours with further details.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="color:#9ca3af;font-size:12px;text-align:center">Hurghada Reiseplaner · <a href="${siteUrl}" style="color:#0057b8">${siteUrl}</a></p>
    </div>
  </div>
</body></html>`;

  try {
    await resend.emails.send({
      from: 'Hurghada Reiseplaner <onboarding@resend.dev>',
      to: booking.email,
      subject: `Booking Confirmed — ${booking.tour_name}`,
      html: customerHtml,
    });
    console.log(`[WEBHOOK] Confirmation email sent to ${booking.email} for booking #${bookingId}`);
  } catch (err) {
    console.error(`[WEBHOOK] Failed to send confirmation email for booking #${bookingId}:`, err);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[WEBHOOK] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[WEBHOOK] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        const paymentIntent =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? '';

        if (bookingId && paymentIntent) {
          const supabase = getSupabaseAdmin();
          const { data: existing } = await supabase
            .from('bookings')
            .select('status')
            .eq('id', bookingId)
            .single();

          if (existing?.status === 'CONFIRMED') {
            console.log(`[WEBHOOK] Booking #${bookingId} already confirmed, skipping (idempotency)`);
            break;
          }

          await confirmBookingPayment(bookingId, paymentIntent);
          await sendConfirmationEmail(bookingId);
          console.log(`[WEBHOOK] Booking #${bookingId} confirmed, pi: ${paymentIntent}`);
        } else {
          console.warn('[WEBHOOK] checkout.session.completed missing bookingId or payment_intent', {
            bookingId,
            paymentIntent,
            sessionId: session.id,
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
          await markBookingPaymentFailed(bookingId, 'Checkout session expired');
          console.log(`[WEBHOOK] Booking #${bookingId} — session expired`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          await markBookingPaymentFailed(
            bookingId,
            paymentIntent.last_payment_error?.message ?? 'Payment failed'
          );
          console.log(`[WEBHOOK] Booking #${bookingId} — payment failed`);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id ?? '';

        if (paymentIntentId) {
          await markBookingRefunded(paymentIntentId);
          console.log(`[WEBHOOK] Payment ${paymentIntentId} refunded`);
        }
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[WEBHOOK] Handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
