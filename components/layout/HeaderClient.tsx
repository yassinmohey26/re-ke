'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import FlagIcon from '@/components/ui/FlagIcon';
import styles from './Header.module.css';

const LOCALES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'ar', label: 'AR' },
  { code: 'fr', label: 'FR' },
  { code: 'hu', label: 'HU' },
] as const;

export default function HeaderClient() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/touren', label: t('tours') },
    { href: '/airport-transfer', label: t('airportTransfer') },
    { href: '/blog', label: t('blog') },
    { href: '/kontakt', label: t('contact') },
    { href: '/terms', label: t('terms') },
  ] as const;

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const pathWithoutLocale = pathname.replace(/^\/(de|en|ru|ar|fr|hu)/, '') || '/';
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
    setLangOpen(false);
  }

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const isTransparent = isHome && !isScrolled && !mobileOpen;

  return (
    <header
      ref={headerRef}
      className={[
        styles.header,
        isScrolled ? styles.scrolled : '',
        isTransparent ? styles.transparent : styles.solid,
        mobileOpen ? styles.mobileOpen : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={t('logoAlt')}>
          <img
            src="/hurghada-logo.png"
            alt={t('logoAlt')}
            className={styles.logoImg}
          />
        </Link>

        <nav className={styles.nav} aria-label={t('mainNav')}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li
                key={link.href}
                className={styles.navItem}
              >
                <Link
                  href={link.href}
                  className={[
                    styles.navLink,
                    pathname === link.href ? styles.active : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Language Switcher */}
        <div className={styles.langSwitcher}>
          <button
            className={`${styles.langBtn} ${langOpen ? styles.langBtnOpen : ''}`}
            onClick={() => setLangOpen(!langOpen)}
            aria-expanded={langOpen}
            aria-label={t('changeLang')}
          >
            <FlagIcon code={currentLocale.code} size={20} />
            <span>{currentLocale.label}</span>
            <svg className={styles.chevron} width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <ul className={`${styles.langDropdown} ${langOpen ? styles.langDropdownOpen : ''}`} role="menu">
            {LOCALES.map((l) => (
              <li key={l.code} role="menuitem">
                <button
                  className={`${styles.langOption} ${l.code === locale ? styles.langOptionActive : ''}`}
                  onClick={() => switchLocale(l.code)}
                >
                  <FlagIcon code={l.code} size={20} />
                  <span className={styles.langOptionLabel}>{l.label}</span>
                  <svg className={styles.langCheck} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 8 7 12 13 4" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className={styles.cta}>
          <Link href="/touren" className="btn btn--primary">
            {tCommon('bookNow')}
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={styles.mobileMenu} aria-hidden={!mobileOpen}>
        <nav aria-label={t('mobileNav')}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className={styles.mobileNavItem}>
                <Link href={link.href} className={styles.mobileNavLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Language Switcher */}
          <div className={styles.mobileNavItem}>
            <div className={styles.mobileLangBar}>
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLocale(l.code)}
                  className={`${styles.mobileLangBtn} ${l.code === locale ? styles.mobileLangBtnActive : ''}`}
                >
                  <FlagIcon code={l.code} size={18} />
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mobileCta}>
            <Link href="/touren" className="btn btn--primary btn--lg">
              {tCommon('bookNow')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
