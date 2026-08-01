'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAdminLocale } from './AdminLanguageContext';
import AdminClock from './AdminClock';
import styles from './page.module.css';

interface Tour { id: string; active: boolean; featured: boolean; }
interface Post { id: string; published: boolean; }

/* ── Animated number counter hook ── */
function useCountUp(target: number, duration = 1100) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.round(ease * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

/* ── Individual stat card ── */
function StatCard({
  label, value, icon, gradient, glow, href, delay,
}: {
  label: string; value: number; icon: string;
  gradient: string; glow: string; href: string; delay: number;
}) {
  const count = useCountUp(value, 1000 + delay);

  return (
    <Link
      href={href}
      className={styles.statCard}
      style={{ '--glow': glow, animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className={styles.statCardBg} style={{ background: gradient }} />
      <div className={styles.statCardContent}>
        <span className={styles.statEmoji}>{icon}</span>
        <span className={styles.statNumber}>{count}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
      <div className={styles.statGlow} style={{ background: glow }} />
    </Link>
  );
}

/* ── Main Dashboard ── */
export default function AdminDashboard() {
  const { t } = useAdminLocale();
  const [tours, setTours] = useState<Tour[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)      setGreeting('Good morning');
    else if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
    else if (hour >= 17 && hour < 21) setGreeting('Good evening');
    else                               setGreeting('Good night');

    setDateStr(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    );

    Promise.all([
      fetch('/api/admin/tours').then(r => r.json()),
      fetch('/api/admin/posts').then(r => r.json()),
    ]).then(([tourData, postData]) => {
      setTours(Array.isArray(tourData) ? tourData : []);
      setPosts(Array.isArray(postData) ? postData : []);
    });
  }, []);

  const activeTours    = tours.filter(t => t.active).length;
  const featuredTours  = tours.filter(t => t.featured).length;
  const publishedPosts = posts.filter(p => p.published).length;

  const STATS = [
    {
      label:    t('statToursActive'),
      value:    activeTours,
      icon:     '🗺️',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      glow:     'rgba(139, 92, 246, 0.5)',
      href:     '/ZAIMOZ/tours',
      delay:    0,
    },
    {
      label:    t('statBlogPosts'),
      value:    publishedPosts,
      icon:     '📝',
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)',
      glow:     'rgba(59, 130, 246, 0.5)',
      href:     '/ZAIMOZ/blog',
      delay:    120,
    },
    {
      label:    t('statFeaturedTours'),
      value:    featuredTours,
      icon:     '⭐',
      gradient: 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)',
      glow:     'rgba(245, 158, 11, 0.5)',
      href:     '/ZAIMOZ/tours',
      delay:    240,
    },
    {
      label:    t('statToursTotal'),
      value:    tours.length,
      icon:     '🌍',
      gradient: 'linear-gradient(135deg, #065f46 0%, #34d399 100%)',
      glow:     'rgba(16, 185, 129, 0.5)',
      href:     '/ZAIMOZ/tours',
      delay:    360,
    },
  ];

  const ACTIONS = [
    {
      icon:  '✈️',
      title: t('newTour'),
      desc:  'Add a new tour package',
      href:  '/ZAIMOZ/tours/new',
      color: '#7c3aed',
    },
    {
      icon:  '✍️',
      title: t('newArticle'),
      desc:  'Write a blog post',
      href:  '/ZAIMOZ/blog/new',
      color: '#1d4ed8',
    },
    {
      icon:     '📋',
      title:    t('manageBookings'),
      desc:     'View & manage bookings',
      href:     '/ZAIMOZ/bookings',
      color:    '#059669',
    },
    {
      icon:     '🌐',
      title:    t('openWebsite'),
      desc:     'See your live site',
      href:     '/',
      color:    '#d97706',
      external: true,
    },
  ];

  return (
    <div className={styles.dashboard}>

      {/* ══ Hero Header ══ */}
      <div className={styles.hero}>
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroTopRow}>
            <div className={styles.greetingBadge}>👋 {greeting}</div>
            <AdminClock />
          </div>
          <h1 className={styles.heroTitle}>{t('dashboardTitle')}</h1>
          <p className={styles.heroDate}>{dateStr}</p>
        </div>
      </div>

      {/* ══ Stat Cards ══ */}
      <div className={styles.statsGrid}>
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ══ Activity Strip ══ */}
      <div className={styles.activityStrip}>
        <div className={styles.activityItem}>
          <div className={styles.activityMeta}>
            <span className={styles.activityLabel}>Active Tours</span>
            <span className={styles.activityCount}>{activeTours} / {tours.length}</span>
          </div>
          <div className={styles.activityBar}>
            <div
              className={styles.activityFill}
              style={{
                width: tours.length ? `${(activeTours / tours.length) * 100}%` : '0%',
                background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              }}
            />
          </div>
        </div>

        <div className={styles.activityDivider} />

        <div className={styles.activityItem}>
          <div className={styles.activityMeta}>
            <span className={styles.activityLabel}>Featured</span>
            <span className={styles.activityCount}>{featuredTours} / {tours.length}</span>
          </div>
          <div className={styles.activityBar}>
            <div
              className={styles.activityFill}
              style={{
                width: tours.length ? `${(featuredTours / tours.length) * 100}%` : '0%',
                background: 'linear-gradient(90deg, #b45309, #fbbf24)',
              }}
            />
          </div>
        </div>

        <div className={styles.activityDivider} />

        <div className={styles.activityItem}>
          <div className={styles.activityMeta}>
            <span className={styles.activityLabel}>Published Posts</span>
            <span className={styles.activityCount}>{publishedPosts} / {posts.length}</span>
          </div>
          <div className={styles.activityBar}>
            <div
              className={styles.activityFill}
              style={{
                width: posts.length ? `${(publishedPosts / posts.length) * 100}%` : '0%',
                background: 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ══ Quick Actions ══ */}
      <div>
        <h2 className={styles.sectionTitle}>⚡ {t('quickActions')}</h2>
        <div className={styles.actionsGrid}>
          {ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={styles.actionCard}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              style={{ '--action-color': action.color } as React.CSSProperties}
            >
              <div
                className={styles.actionIconWrap}
                style={{ background: `${action.color}1a` }}
              >
                <span className={styles.actionEmoji}>{action.icon}</span>
              </div>
              <div className={styles.actionText}>
                <span className={styles.actionTitle}>{action.title}</span>
                <span className={styles.actionDesc}>{action.desc}</span>
              </div>
              <span className={styles.actionArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
