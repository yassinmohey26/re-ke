'use client';

import { useState } from 'react';
import { useAdminLocale } from '../AdminLanguageContext';
import ImageUpload from '@/components/admin/ImageUpload';
import styles from './BlogForm.module.css';

interface BlogFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

export default function BlogForm({ initialData, onSave, saving }: BlogFormProps) {
  const { t } = useAdminLocale();

  const [form, setForm] = useState({
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    image: initialData?.image || '',
    category: initialData?.category || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    readTime: initialData?.readTime || initialData?.read_time || '5 Min',
    tags: (initialData?.tags || []).join(', '),
    author: initialData?.author || 'Hurghada Reiseplaner',
    published: initialData?.published !== false,
    featured: initialData?.featured || false,
  });

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function generateSlug() {
    update('slug', form.title
      .toLowerCase()
      .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/[ß]/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    };
    await onSave(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('blogBasics')}</h2>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>{t('blogTitleLabel')}</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input className={styles.input} value={form.title} onChange={e => update('title', e.target.value)} required />
              <button type="button" onClick={generateSlug} className={styles.slugBtn}>Slug</button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('blogSlug')}</label>
            <input className={styles.input} value={form.slug} onChange={e => update('slug', e.target.value)} required />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t('blogShortDesc')}</label>
          <input className={styles.input} value={form.excerpt} onChange={e => update('excerpt', e.target.value)} required />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('blogContent')}</h2>
        <div className={styles.field}>
          <textarea className={styles.textarea} rows={12} value={form.content} onChange={e => update('content', e.target.value)} placeholder="<p>Content...</p>" />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('blogDetails')}</h2>
        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label}>{t('blogCategory')}</label>
            <input className={styles.input} value={form.category} onChange={e => update('category', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('blogDate')}</label>
            <input className={styles.input} type="date" value={form.date} onChange={e => update('date', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('blogReadTime')}</label>
            <input className={styles.input} value={form.readTime} onChange={e => update('readTime', e.target.value)} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>{t('blogAuthor')}</label>
            <input className={styles.input} value={form.author} onChange={e => update('author', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('blogTags')}</label>
            <input className={styles.input} value={form.tags} onChange={e => update('tags', e.target.value)} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('blogImage')}</h2>
        <div className={styles.field}>
          <ImageUpload
            value={form.image}
            onChange={(url) => update('image', url)}
            folder="hurghada-reiseplaner/blog"
            label={t('blogImageUrl')}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} />
            <span>{t('blogFeatured')}</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} />
            <span>{t('blogPublished')}</span>
          </label>
        </div>
      </div>

      <div className={styles.formActions}>
        <a href="/ZAIMOZ/blog" className={styles.cancelBtn}>{t('blogCancel')}</a>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? t('blogSave') : initialData ? t('blogUpdate') : t('blogCreate')}
        </button>
      </div>
    </form>
  );
}
