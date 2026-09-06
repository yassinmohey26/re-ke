import { z } from 'zod';

export function isValidBookingDate(value: string, today = new Date()): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match;
  const selectedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  if (
    selectedDate.getFullYear() !== Number(year) ||
    selectedDate.getMonth() !== Number(month) - 1 ||
    selectedDate.getDate() !== Number(day)
  ) {
    return false;
  }

  const minimumDate = new Date(today);
  minimumDate.setHours(0, 0, 0, 0);

  return selectedDate >= minimumDate;
}

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
    .refine(isValidBookingDate, 'Datum muss in der Zukunft liegen'),
  guests: z
    .number()
    .int()
    .min(1, 'Mindestens 1 Person')
    .max(8, 'Maximal 8 Personen'),
  adults: z.number().int().min(0).max(20),
  children: z.number().int().min(0).max(20),
  infants: z.number().int().min(0).max(20),
  message: z.string().max(2000).optional().or(z.literal('')),
  hotelRegion: z.string().max(40).optional(),
  extrasJson: z.string().optional(),
  paymentOption: z.enum(['full', 'deposit']).transform(val => val ?? 'full'),
  locale: z.enum(['de', 'en', 'fr', 'hu', 'ru', 'ar']).optional(),
});

export interface BookingValidationMessages {
  firstNameMin: string;
  firstNameMax: string;
  lastNameMin: string;
  lastNameMax: string;
  emailInvalid: string;
  phoneMin: string;
  phoneMax: string;
  dateInvalid: string;
  guestsMin: string;
  guestsMax: string;
  messageMax: string;
}

export function createBookingSchema(messages: BookingValidationMessages) {
  return z.object({
    tourSlug: z.string().min(1),
    tourName: z.string().min(1),
    firstName: z.string().min(2, messages.firstNameMin).max(60, messages.firstNameMax).trim(),
    lastName: z.string().min(2, messages.lastNameMin).max(60, messages.lastNameMax).trim(),
    email: z.string().email(messages.emailInvalid).max(254).trim().toLowerCase(),
    phone: z.string().min(7, messages.phoneMin).max(30, messages.phoneMax),
    date: z.string().refine(isValidBookingDate, messages.dateInvalid),
    guests: z.number().int().min(1, messages.guestsMin).max(8, messages.guestsMax),
    adults: z.number().int().min(0).max(20),
    children: z.number().int().min(0).max(20),
    infants: z.number().int().min(0).max(20),
    message: z.string().max(2000, messages.messageMax).optional().or(z.literal('')),
    hotelRegion: z.string().max(40).optional(),
    extrasJson: z.string().optional(),
    paymentOption: z.enum(['full', 'deposit']).transform(val => val ?? 'full'),
    locale: z.enum(['de', 'en', 'fr', 'hu', 'ru', 'ar']).optional(),
  });
}

export type BookingFormData = z.infer<typeof bookingSchema>;

// ── Newsletter Subscription ───────────────────────────────────────
export const newsletterSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse').max(254).trim().toLowerCase(),
  name: z.string().max(100).optional().or(z.literal('')),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
