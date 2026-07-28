import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMeta('impressumTitle');
  const description = tMeta('impressumDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/impressum`,
      siteName: 'Hurghada Reiseplaner',
      images: [{ url: `${baseUrl}/og-default.jpg`, width: 1200, height: 630, alt: title }],
      locale: localeMap[locale] || 'de_AT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-default.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/impressum`,
      languages: {
        'de': `${baseUrl}/de/impressum`,
        'en': `${baseUrl}/en/impressum`,
        'ru': `${baseUrl}/ru/impressum`,
        'ar': `${baseUrl}/ar/impressum`,
        'fr': `${baseUrl}/fr/impressum`,
        'hu': `${baseUrl}/hu/impressum`,
        'x-default': `${baseUrl}/de/impressum`,
      },
    },
  };
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'impressum' });

  const sections = [
    { title: t('s1Title'), text: t('s1Text') },
    { title: t('s2Title'), text: t('s2Text') },
    { title: t('s3Title'), text: t('s3Text') },
    { title: t('s4Title'), text: t('s4Text') },
    { title: t('s5Title'), text: t('s5Text') },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <section className="section">
        <div className="container">
          <div className={styles.content}>
            {sections.map((section, i) => (
              <div key={i}>
                <h2>{section.title}</h2>
                <p dangerouslySetInnerHTML={{ __html: section.text }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
