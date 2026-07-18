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
    };

    const parsed = bookingSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
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

    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: data.email,
          subject: `Buchungsanfrage erhalten — ${data.tourName}`,
          html: `
            <h2>Vielen Dank für Ihre Buchungsanfrage!</h2>
            <p>Liebe/r ${data.firstName} ${data.lastName},</p>
            <p>Wir haben Ihre Anfrage für <strong>${data.tourName}</strong> erhalten
               und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
            <hr/>
            <h3>Ihre Buchungsdetails:</h3>
            <p><strong>Tour:</strong> ${data.tourName}</p>
            <p><strong>Datum:</strong> ${new Date(data.date).toLocaleDateString('de-AT')}</p>
            <p><strong>Personen:</strong> ${data.guests}</p>
            <p><strong>Buchungs-ID:</strong> #${booking.id}</p>
            <hr/>
            <p>Mit freundlichen Grüßen,<br/>Ihr Hurghada Reiseplaner Team</p>
          `,
        });
      }
    } catch (e) {
      console.error('Booking email error (non-fatal):', e);
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
