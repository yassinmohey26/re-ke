import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  const title = tMeta('datenschutzTitle');
  const description = tMeta('datenschutzDescription');
  const localeMap: Record<string, string> = { de: 'de_AT', en: 'en_US', ru: 'ru_RU', ar: 'ar_EG', fr: 'fr_FR', hu: 'hu_HU' };
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/datenschutz`,
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
      canonical: `${baseUrl}/${locale}/datenschutz`,
      languages: {
        'de': `${baseUrl}/de/datenschutz`,
        'en': `${baseUrl}/en/datenschutz`,
        'ru': `${baseUrl}/ru/datenschutz`,
        'ar': `${baseUrl}/ar/datenschutz`,
        'fr': `${baseUrl}/fr/datenschutz`,
        'hu': `${baseUrl}/hu/datenschutz`,
        'x-default': `${baseUrl}/de/datenschutz`,
      },
    },
  };
}

export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'datenschutz' });

  const sections = [
    { title: t('s1Title'), text: t('s1Text') },
    { title: t('s2Title'), text: t('s2Text1') },
    { title: undefined, text: t('s2Text2') },
    { title: t('s3Title'), text: t('s3Text') },
    { title: t('s4Title'), text: t('s4Text') },
    { title: t('s5Title'), text: t('s5Text') },
    { title: t('s6Title'), text: t('s6Text') },
    { title: t('s7Title'), text: t('s7Text') },
    { title: t('s8Title'), text: t('s8Text') },
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
              section.title ? (
                <div key={i}>
                  <h2>{section.title}</h2>
                  <p dangerouslySetInnerHTML={{ __html: section.text }} />
                </div>
              ) : (
                <p key={i} dangerouslySetInnerHTML={{ __html: section.text }} />
              )
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
