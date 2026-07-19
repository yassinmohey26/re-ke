'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminLocale } from './AdminLanguageContext';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const NAV_HREFS = ['/ZAIMOZ', '/ZAIMOZ/tours', '/ZAIMOZ/blog', '/ZAIMOZ/bookings', '/ZAIMOZ/contacts', '/ZAIMOZ/newsletter', '/ZAIMOZ/faqs', '/ZAIMOZ/destinations', '/ZAIMOZ/translations'] as const;
const NAV_KEYS = ['navDashboard', 'navTours', 'navBlog', 'navBookings', 'navContacts', 'navNewsletter', 'navFaqs', 'navDestinations', 'navTranslations'] as const;
const NAV_ICONS = ['◈', '◈', '◎', '◉', '◎', '◇', '?', '◆', '🌍'];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useAdminLocale();

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Link href="/ZAIMOZ" className={styles.logo}>
          {t('logo')}
        </Link>
      </div>

      <nav className={styles.sidebarNav}>
        {NAV_HREFS.map((href, i) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${(pathname === href || (href !== '/ZAIMOZ' && pathname.startsWith(href))) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{NAV_ICONS[i]}</span>
            {t(NAV_KEYS[i])}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.langSwitcher}>
          <button
            className={`${styles.langBtn} ${locale === 'de' ? styles.langActive : ''}`}
            onClick={() => setLocale('de')}
          >
            🇩🇪 DE
          </button>
          <button
            className={`${styles.langBtn} ${locale === 'en' ? styles.langActive : ''}`}
            onClick={() => setLocale('en')}
          >
            🇬🇧 EN
          </button>
          <button
            className={`${styles.langBtn} ${locale === 'ru' ? styles.langActive : ''}`}
            onClick={() => setLocale('ru')}
          >
            🇷🇺 RU
          </button>
        </div>
        <Link href="/" className={styles.navItem} target="_blank" rel="noopener noreferrer">
          <span className={styles.navIcon}>↗</span>
          {t('viewWebsite')}
        </Link>
        <button
          className={styles.navItem}
          onClick={handleSignOut}
        >
          <span className={styles.navIcon}>⏻</span>
          {t('signOut')}
        </button>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user.name?.charAt(0) || 'A'}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user.name || 'Admin'}</span>
            <span className={styles.userRole}>{user.role || 'ADMIN'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
