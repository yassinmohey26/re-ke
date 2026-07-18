'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogForm from '../../BlogForm';
import { useAdminLocale } from '../../../AdminLanguageContext';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useAdminLocale();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/posts/${id}`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSave(data: any) {
    setSaving(true);
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push('/ZAIMOZ/blog');
    } else {
      alert(t('saveError'));
    }
    setSaving(false);
  }

  if (loading) return <p style={{ padding: 'var(--space-8)', color: 'var(--color-text-3)' }}>{t('blogLoadingPost')}</p>;
  if (!post?.id) return <p style={{ padding: 'var(--space-8)', color: '#dc2626' }}>{t('blogNotFound')}</p>;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link href="/ZAIMOZ/blog" style={{ fontSize: '14px', color: 'var(--color-accent)', textDecoration: 'none' }}>
          {t('backToBlog')}
        </Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'var(--color-text-1)', marginTop: 'var(--space-3)' }}>
          {t('editBlogTitle')} {post.title}
        </h1>
      </div>
      <BlogForm initialData={post} onSave={handleSave} saving={saving} />
    </div>
  );
}
