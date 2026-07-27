'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminLocale } from '../AdminLanguageContext';
import LocalePicker from '@/components/admin/LocalePicker';
import styles from './page.module.css';

interface Post {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  published: boolean;
  featured: boolean;
}

export default function AdminBlogPage() {
  const { t, locale } = useAdminLocale();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [duplicateId, setDuplicateId] = useState<string | null>(null);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const res = await fetch('/api/admin/posts');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(t('confirmDeletePost'))) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    if (res.ok) setPosts(posts.filter(p => p.id !== id));
  }

  async function togglePublished(id: string, current: boolean) {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) setPosts(posts.map(p => p.id === id ? { ...p, published: !current } : p));
  }

  async function toggleFeatured(id: string, current: boolean) {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !current }),
    });
    if (res.ok) setPosts(posts.map(p => p.id === id ? { ...p, featured: !current } : p));
  }

  async function handleDuplicate(dupLocale: string) {
    if (!duplicateId) return;
    const res = await fetch('/api/admin/duplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'blog_posts', id: duplicateId, locale: dupLocale }),
    });
    setDuplicateId(null);
    if (res.ok) {
      router.push(`/ZAIMOZ/blog/edit/${duplicateId}`);
    } else {
      const err = await res.json();
      alert(err.error || 'Duplicate failed');
    }
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const dateLocale = locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar-EG' : locale === 'fr' ? 'fr-FR' : locale === 'hu' ? 'hu-HU' : locale === 'ru' ? 'ru-RU' : 'de-AT';

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('blogTitle')}</h1>
          <p className={styles.subtitle}>{posts.length} {t('blogTotal')}</p>
        </div>
        <Link href="/ZAIMOZ/blog/new" className={styles.addBtn}>{t('newArticleBtn')}</Link>
      </div>

      <div className={styles.filters}>
        <input type="text" placeholder={t('blogSearch')} value={search} onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
      </div>

      {loading ? (
        <p className={styles.loading}>{t('blogLoading')}</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('blogColTitle')}</th>
                <th>{t('blogColCategory')}</th>
                <th>{t('blogColDate')}</th>
                <th>{t('blogColAuthor')}</th>
                <th>{t('blogColFeatured')}</th>
                <th>{t('blogColPublished')}</th>
                <th>{t('blogColActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id}>
                  <td className={styles.postTitle}>{post.title}</td>
                  <td><span className={styles.badge}>{post.category}</span></td>
                  <td>{post.date ? new Date(post.date).toLocaleDateString(dateLocale) : '—'}</td>
                  <td>{post.author}</td>
                  <td>
                    <button
                      className={`${styles.toggleBtn} ${post.featured ? styles.activeToggle : ''}`}
                      onClick={() => toggleFeatured(post.id, post.featured)}
                    >
                      {post.featured ? '★' : '☆'}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${styles.toggleBtn} ${post.published ? styles.activeToggle : ''}`}
                      onClick={() => togglePublished(post.id, post.published)}
                    >
                      {post.published ? '✓' : '✕'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/ZAIMOZ/blog/edit/${post.id}`} className={styles.editBtn}>{t('edit')}</Link>
                      <button className={styles.editBtn} onClick={() => setDuplicateId(post.id)}>
                        {t('duplicateBtn')}
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(post.id)}>{t('delete')}</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>{t('blogNoResults')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {duplicateId && (
        <LocalePicker
          onSelect={handleDuplicate}
          onCancel={() => setDuplicateId(null)}
        />
      )}
    </div>
  );
}
