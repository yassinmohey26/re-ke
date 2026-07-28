'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import NewsletterForm from '@/components/forms/NewsletterForm';
import styles from './Footer.module.css';

export default function FooterClient() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tNl = useTranslations('newsletter');
  const tTours = useTranslations('tours');
  const year = new Date().getFullYear();

  const TOUR_LINKS = [
    { href: '/touren', label: tTours('allTours') },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand Column */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink} aria-label={tNav('logoAlt')}>
            <span className={styles.logoText}>
              Hurghada<br />
              <strong>Reiseplaner</strong>
            </span>
          </Link>
          <p className={styles.tagline}>
            {t('tagline')}
          </p>
          {/* Contact quick info */}
          <div className={styles.contactInfo}>
            <a href="mailto:info@hurghada-reiseplaner.at" className={styles.contactLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {t('email')}
            </a>
            <a
              href="https://wa.me/4368181140099"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 2a10 10 0 0 0-8.527 15.256L2 22l4.744-1.473A10 10 0 1 0 12 2z"/>
              </svg>
              {t('whatsapp')}
            </a>
          </div>
        </div>

        {/* Tour links */}
        <nav className={styles.navCol} aria-label={t('toursLabel')}>
          <h3 className={styles.colTitle}>{t('toursLabel')}</h3>
          <ul className={styles.colList}>
            {TOUR_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.colLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Info links */}
        <nav className={styles.navCol} aria-label={t('infoLabel')}>
          <h3 className={styles.colTitle}>{t('infoLabel')}</h3>
          <ul className={styles.colList}>
            <li>
              <Link href="/blog" className={styles.colLink}>
                {tNav('blog')}
              </Link>
            </li>
            <li>
              <Link href="/faq" className={styles.colLink}>
                {t('faq')}
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className={styles.colLink}>
                {tNav('contact')}
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className={styles.colLink}>
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Link href="/impressum" className={styles.colLink}>
                {t('imprint')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Newsletter */}
        <div className={styles.newsletterCol}>
          <h3 className={styles.colTitle}>{tNl('title')}</h3>
          <p className={styles.newsletterText}>
            {tNl('description')}
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {year} {t('copyright')}
          </p>
          <div className={styles.legal}>
            <Link href="/datenschutz">{t('privacy')}</Link>
            <Link href="/impressum">{t('imprint')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
