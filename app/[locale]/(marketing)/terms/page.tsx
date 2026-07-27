import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('termsTitle'),
    description: t('termsDescription'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at'}/${locale}/terms`,
      languages: {
        de: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at'}/de/terms`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at'}/en/terms`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at'}/ru/terms`,
        ar: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at'}/ar/terms`,
        fr: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at'}/fr/terms`,
        hu: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at'}/hu/terms`,
      },
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!['de', 'en', 'ru', 'ar', 'fr', 'hu'].includes(locale)) notFound();
  
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.lastUpdated}>{t('lastUpdated', { date: new Date().toLocaleDateString(locale) })}</p>
        </header>

        <div className={styles.agencyCard}>
          <div className={styles.agencyCardAccent} />
          <div className={styles.agencyCardBody}>
            <h3 className={styles.agencyCardTitle}>{t('contact.title')}</h3>
            <div className={styles.agencyCardDetails}>
              <div className={styles.agencyCardRow}>
                <svg className={styles.agencyCardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <p className={styles.agencyCardLabel}>{locale === 'de' ? 'Adresse' : locale === 'fr' ? 'Adresse' : locale === 'ru' ? 'Адрес' : locale === 'ar' ? 'العنوان' : locale === 'hu' ? 'Cím' : 'Address'}</p>
                  <p className={styles.agencyCardValue}>{t('contact.address')}</p>
                </div>
              </div>
            </div>
            <p><Link href="/kontakt" className={styles.link}>{t('contact.link')}</Link></p>
          </div>
        </div>

        <section className={styles.section}>
          <h2>{t('intro.title')}</h2>
          <p>{t('intro.text')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('booking.title')}</h2>
          <p>{t('booking.text')}</p>
          <ul>
            <li>{t('booking.points.confirmation')}</li>
            <li>{t('booking.points.payment')}</li>
            <li>{t('booking.points.cancellation')}</li>
            <li>{t('booking.points.modification')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('payment.title')}</h2>
          <p>{t('payment.text')}</p>
          <ul>
            <li>{t('payment.points.methods')}</li>
            <li>{t('payment.points.deposit')}</li>
            <li>{t('payment.points.balance')}</li>
            <li>{t('payment.points.currency')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('cancellation.title')}</h2>
          <p>{t('cancellation.text')}</p>
          <ul>
            <li>{t('cancellation.points.free24h')}</li>
            <li>{t('cancellation.points.late')}</li>
            <li>{t('cancellation.points.noshow')}</li>
            <li>{t('cancellation.points.forceMajeure')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('services.title')}</h2>
          <p>{t('services.text')}</p>
          <ul>
            <li>{t('services.points.transfer')}</li>
            <li>{t('services.points.guide')}</li>
            <li>{t('services.points.equipment')}</li>
            <li>{t('services.points.meals')}</li>
            <li>{t('services.points.insurance')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('liability.title')}</h2>
          <p>{t('liability.text')}</p>
          <ul>
            <li>{t('liability.points.personal')}</li>
            <li>{t('liability.points.property')}</li>
            <li>{t('liability.points.forceMajeure')}</li>
            <li>{t('liability.points.maxLiability')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>{t('stripe.title')}</h2>
          <p>{t('stripe.text')}</p>
          <p><a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
            https://stripe.com/legal
          </a></p>
          <p>{t('stripe.agreement')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('privacy.title')}</h2>
          <p>{t('privacy.text')}</p>
          <p><Link href={`/${locale}/datenschutz`} className={styles.link}>{t('privacy.policyLink')}</Link></p>
        </section>

        <section className={styles.section}>
          <h2>{t('governingLaw.title')}</h2>
          <p>{t('governingLaw.text')}</p>
        </section>
      </main>
    </div>
  );
}