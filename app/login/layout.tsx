import type { Metadata } from 'next';
import { DM_Sans, Outfit, Marcellus } from 'next/font/google';
import '../globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-marcellus',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Login',
  description: 'Admin-Bereich einloggen',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${dmSans.variable} ${outfit.variable} ${marcellus.variable}`}>{children}</div>;
}
