import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hurghada-reiseplaner.at';
  return {
    title: tMeta('impressumTitle'),
    description: tMeta('impressumDescription'),
    alternates: {
      canonical: `${baseUrl}/${locale}/impressum`,
      languages: {
        'de': `${baseUrl}/de/impressum`,
        'en': `${baseUrl}/en/impressum`,
        'ru': `${baseUrl}/ru/impressum`,
        'ar': `${baseUrl}/ar/impressum`,
        'fr': `${baseUrl}/fr/impressum`,
        'hu': `${baseUrl}/hu/impressum`,
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
