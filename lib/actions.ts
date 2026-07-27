'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { contactSchema, bookingSchema } from '@/lib/validations';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

// ── Contact Form Action ───────────────────────────────────────────
export async function submitContact(formData: FormData) {
  try {
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      website: formData.get('website'), // honeypot
    };

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    if (data.website && data.website.length > 0) {
      return { success: true };
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });

    if (error) throw error;

    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: process.env.EMAIL_TO!,
          subject: `Neue Kontaktanfrage von ${data.name}`,
          html: `
            <h2>Neue Kontaktanfrage</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>E-Mail:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ''}
            ${data.subject ? `<p><strong>Betreff:</strong> ${data.subject}</p>` : ''}
            <p><strong>Nachricht:</strong></p>
            <p style="white-space:pre-wrap">${data.message}</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Email send failed (non-fatal):', emailError);
    }

    return { success: true };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    };
  }
}

// ── Booking Form Action ───────────────────────────────────────────
export async function submitBooking(formData: FormData) {
  try {
    const totalPriceRaw = formData.get('totalPrice');
    const extrasJsonRaw = formData.get('extrasJson');

    const raw = {
      tourSlug: formData.get('tourSlug'),
      tourName: formData.get('tourName'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      guests: Number(formData.get('guests')),
      message: formData.get('message'),
      totalPrice: totalPriceRaw ? Number(totalPriceRaw) : undefined,
      paymentOption: formData.get('paymentOption') || 'full',
      extrasJson: extrasJsonRaw ? String(extrasJsonRaw) : undefined,
    };

    const parsed = bookingSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    let extras: { id: string; name: string; price: number }[] = [];
    try {
      extras = data.extrasJson ? JSON.parse(data.extrasJson) : [];
    } catch {
      extras = [];
    }

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
        total_price: data.totalPrice ?? null,
        payment_option: data.paymentOption || 'full',
        extras,
      })
      .select('id')
      .single();

    if (error) throw error;

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const dateStr = new Date(data.date).toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
      const extrasHtml = extras.length
        ? `<tr><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Extras</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#374151">${extras.map(e => e.name).join(', ')}</td></tr>`
        : '';
      const priceHtml = data.totalPrice
        ? `<tr><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Total Price</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#374151;font-weight:700;font-size:18px">€${data.totalPrice}</td></tr>`
        : '';

      const adminHtml = `
        <h2>Neue Buchungsanfrage</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Tour</td><td style="padding:8px;border:1px solid #ddd">${data.tourName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Kunde</td><td style="padding:8px;border:1px solid #ddd">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">E-Mail</td><td style="padding:8px;border:1px solid #ddd"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Telefon</td><td style="padding:8px;border:1px solid #ddd">${data.phone || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Datum</td><td style="padding:8px;border:1px solid #ddd">${dateStr}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Personen</td><td style="padding:8px;border:1px solid #ddd">${data.guests}</td></tr>
          ${extras.length ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Extras</td><td style="padding:8px;border:1px solid #ddd">${extras.map(e => e.name).join(', ')}</td></tr>` : ''}
          ${data.totalPrice ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Gesamtpreis</td><td style="padding:8px;border:1px solid #ddd">€${data.totalPrice}</td></tr>` : ''}
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Buchungs-ID</td><td style="padding:8px;border:1px solid #ddd">#${booking.id}</td></tr>
        </table>
        <p style="margin-top:16px"><a href="${siteUrl}/ZAIMOZ/bookings" style="background:#0057b8;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px">Im Admin anzeigen</a></p>
      `;

      const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">
    <div style="background:linear-gradient(135deg,#0057b8 0%,#003d82 100%);padding:32px 24px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">Hurghada Reiseplaner</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Your Egypt Adventure Starts Here</p>
    </div>
    <div style="padding:32px 24px">
      <p style="margin:0 0 16px;color:#374151;font-size:15px">Liebe/r ${data.firstName} ${data.lastName},</p>
      <h2 style="margin:0 0 8px;color:#111827;font-size:20px">Vielen Dank für Ihre Buchung!</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Wir haben Ihre Anfrage für <strong>${data.tourName}</strong> erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px"/>
      <p style="margin:0 0 16px;color:#374151;font-size:15px">Dear ${data.firstName} ${data.lastName},</p>
      <h2 style="margin:0 0 8px;color:#111827;font-size:20px">Thank you for your booking!</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px">We have received your request for <strong>${data.tourName}</strong> and will get back to you within 24 hours.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px"/>
      <p style="margin:0 0 16px;color:#374151;font-size:15px">Уважаемый(ая) ${data.firstName} ${data.lastName},</p>
      <h2 style="margin:0 0 8px;color:#111827;font-size:20px">Спасибо за ваше бронирование!</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Мы получили ваш запрос на <strong>${data.tourName}</strong> и свяжемся с вами в течение 24 часов.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px"/>
      <h3 style="margin:0 0 12px;color:#111827;font-size:16px">Booking Details / Buchungsdaten / Данные бронирования</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px;border:1px solid #e5e7eb">
        <tr><td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;width:40%">Tour</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827">${data.tourName}</td></tr>
        <tr><td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Name</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827">${data.firstName} ${data.lastName}</td></tr>
        <tr><td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">E-Mail</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827">${data.email}</td></tr>
        <tr><td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Phone / Telefon / Телефон</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827">${data.phone || '—'}</td></tr>
        <tr><td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Date / Datum / Дата</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:600">${dateStr}</td></tr>
        <tr><td style="padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151">Guests / Personen / Гости</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:600">${data.guests}</td></tr>
        ${extrasHtml}
        ${priceHtml}
        <tr><td style="padding:12px 16px;background:#f9fafb;font-weight:600;color:#374151">Booking ID / Buchungs-ID / ID бронирования</td><td style="padding:12px 16px;color:#0057b8;font-weight:700">#${booking.id}</td></tr>
      </table>
      <div style="text-align:center;margin-bottom:24px">
        <a href="${siteUrl}" style="display:inline-block;background:#0057b8;color:#ffffff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px">Visit Hurghada Reiseplaner</a>
      </div>
      <div style="background:#f9fafb;padding:20px 24px;border-radius:8px;text-align:center">
        <p style="margin:0 0 4px;color:#6b7280;font-size:13px">Hurghada Reiseplaner — Your trusted partner for Egypt travel</p>
        <p style="margin:0 0 4px;color:#9ca3af;font-size:12px">+43 681 81140099 | info@hurghada-reiseplaner.at</p>
        <p style="margin:0;color:#9ca3af;font-size:12px"><a href="${siteUrl}" style="color:#0057b8;text-decoration:none">hurghada-reiseplaner.at</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;

      // Admin notification email (sends to your own email — always works with onboarding@resend.dev)
      const adminEmail = process.env.EMAIL_TO || process.env.EMAIL_FROM;
      if (adminEmail) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: adminEmail,
            subject: `Neue Buchungsanfrage — ${data.tourName}`,
            html: adminHtml,
          });
          console.log('[BOOKING] Admin email sent to:', adminEmail);
        } catch (e) {
          console.error('[BOOKING] Admin email failed:', e);
        }
      }

      // Customer confirmation email (requires domain verification for external recipients)
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: data.email,
          subject: `Booking Confirmation — ${data.tourName}`,
          html: customerHtml,
        });
        console.log('[BOOKING] Customer email sent to:', data.email);
      } catch (e) {
        console.error('[BOOKING] Customer email failed (domain verification needed for external recipients):', e);
      }
    }

    revalidatePath('/ZAIMOZ/bookings');
    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error('Booking error:', error);
    return { success: false, error: 'Buchung fehlgeschlagen. Bitte erneut versuchen.' };
  }
}

// ── Newsletter Subscription Action ───────────────────────────────
export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { success: false, error: 'Ungültige E-Mail-Adresse.' };
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email, name: formData.get('name') || null, source: 'website' },
        { onConflict: 'email', ignoreDuplicates: false }
      );

    if (error) {
      if (error.code === '23505') {
        return { success: true };
      }
      throw error;
    }

    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      try {
        const server = process.env.MAILCHIMP_SERVER_PREFIX ?? 'us1';
        const response = await fetch(
          `https://${server}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email_address: email,
              status: 'subscribed',
            }),
          }
        );
        if (!response.ok) {
          const err = await response.json();
          if (err.title !== 'Member Exists') {
            console.error('Mailchimp error:', err);
          }
        }
      } catch (e) {
        console.error('Mailchimp sync error (non-fatal):', e);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Newsletter error:', error);
    return { success: false, error: 'Anmeldung fehlgeschlagen.' };
  }
}
