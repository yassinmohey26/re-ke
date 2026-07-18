import { z } from 'zod';

// ── Contact Form ──────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name muss mindestens 2 Zeichen haben')
    .max(100, 'Name zu lang')
    .trim(),
  email: z
    .string()
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
    .max(254)
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .max(30, 'Telefonnummer zu lang')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .max(200, 'Betreff zu lang')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Nachricht muss mindestens 10 Zeichen haben')
    .max(5000, 'Nachricht zu lang')
    .trim(),
  // Honeypot field — bots fill this in, humans leave it empty
  website: z.string().max(0, 'Spam detected').optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ── Booking Form ──────────────────────────────────────────────────
export const bookingSchema = z.object({
  tourSlug: z.string().min(1),
  tourName: z.string().min(1),
  firstName: z
    .string()
    .min(2, 'Vorname muss mindestens 2 Zeichen haben')
    .max(60)
    .trim(),
  lastName: z
    .string()
    .min(2, 'Nachname muss mindestens 2 Zeichen haben')
    .max(60)
    .trim(),
  email: z.string().email('Ungültige E-Mail-Adresse').max(254).trim().toLowerCase(),
  phone: z
    .string()
    .min(7, 'Telefonnummer muss mindestens 7 Zeichen haben')
    .max(30),
  date: z
    .string()
    .refine((d) => {
      const date = new Date(d);
      return !isNaN(date.getTime()) && date > new Date();
    }, 'Datum muss in der Zukunft liegen'),
  guests: z
    .number()
    .int()
    .min(1, 'Mindestens 1 Person')
    .max(20, 'Maximal 20 Personen'),
  message: z.string().max(2000).optional().or(z.literal('')),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ── Newsletter Subscription ───────────────────────────────────────
export const newsletterSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse').max(254).trim().toLowerCase(),
  name: z.string().max(100).optional().or(z.literal('')),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
