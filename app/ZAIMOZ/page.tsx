'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAdminLocale } from './AdminLanguageContext';
import styles from './page.module.css';

interface Tour { id: string; active: boolean; featured: boolean; }
interface Post { id: string; published: boolean; }

export default function AdminDashboard() {
  const { t } = useAdminLocale();
  const [tours, setTours] = useState<Tour[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/tours').then(r => r.json()),
      fetch('/api/admin/posts').then(r => r.json()),
    ]).then(([tourData, postData]) => {
      setTours(tourData);
      setPosts(postData);
    });
  }, []);

  const activeTours = tours.filter(t => t.active).length;
  const featuredTours = tours.filter(t => t.featured).length;
  const publishedPosts = posts.filter(p => p.published).length;

  const STATS = [
    { label: t('statToursActive'), value: activeTours, icon: '◈', href: '/ZAIMOZ/tours', color: '#8b5cf6' },
    { label: t('statBlogPosts'), value: publishedPosts, icon: '◎', href: '/ZAIMOZ/blog', color: '#3b82f6' },
    { label: t('statFeaturedTours'), value: featuredTours, icon: '★', href: '/ZAIMOZ/tours', color: '#f59e0b' },
    { label: t('statToursTotal'), value: tours.length, icon: '◉', href: '/ZAIMOZ/tours', color: '#10b981' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('dashboardTitle')}</h1>
        <p className={styles.subtitle}>{t('dashboardSubtitle')}</p>
      </div>

      <div className={styles.statsGrid}>
        {STATS.map((stat) => (
          <Link key={stat.label} href={stat.href} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: stat.color }}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>{t('quickActions')}</h2>
        <div className={styles.actionsGrid}>
          <Link href="/ZAIMOZ/tours/new" className={styles.actionCard}>
            <span className={styles.actionIcon}>+</span>
            <span>{t('newTour')}</span>
          </Link>
          <Link href="/ZAIMOZ/blog/new" className={styles.actionCard}>
            <span className={styles.actionIcon}>+</span>
            <span>{t('newArticle')}</span>
          </Link>
          <Link href="/ZAIMOZ/bookings" className={styles.actionCard}>
            <span className={styles.actionIcon}>◉</span>
            <span>{t('manageBookings')}</span>
          </Link>
          <Link href="/" className={styles.actionCard} target="_blank" rel="noopener noreferrer">
            <span className={styles.actionIcon}>↗</span>
            <span>{t('openWebsite')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
