'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogForm from '../BlogForm';
import { useAdminLocale } from '../../AdminLanguageContext';

export default function NewBlogPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const [saving, setSaving] = useState(false);

  async function handleSave(data: any) {
    setSaving(true);
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
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

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link href="/ZAIMOZ/blog" style={{ fontSize: '14px', color: 'var(--color-accent)', textDecoration: 'none' }}>
          {t('backToBlog')}
        </Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'var(--color-text-1)', marginTop: 'var(--space-3)' }}>
          {t('newBlogTitle')}
        </h1>
      </div>
      <BlogForm onSave={handleSave} saving={saving} />
    </div>
  );
}
