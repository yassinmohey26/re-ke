'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TourForm from '../../TourForm';
import { useAdminLocale } from '../../../AdminLanguageContext';

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useAdminLocale();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/tours/${id}`)
      .then(r => r.json())
      .then(data => { setTour(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSave(data: any) {
    setSaving(true);
    const res = await fetch(`/api/admin/tours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push('/ZAIMOZ/tours');
    } else {
      alert(t('saveError'));
    }
    setSaving(false);
  }

  if (loading) return <p style={{ padding: 'var(--space-8)', color: 'var(--color-text-3)' }}>{t('tourLoading')}</p>;
  if (!tour?.id) return <p style={{ padding: 'var(--space-8)', color: '#dc2626' }}>{t('tourNotFound')}</p>;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link href="/ZAIMOZ/tours" style={{ fontSize: '14px', color: 'var(--color-accent)', textDecoration: 'none' }}>
          {t('backToTours')}
        </Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'var(--color-text-1)', marginTop: 'var(--space-3)' }}>
          {t('editTourTitle')} {tour.name}
        </h1>
      </div>
      <TourForm initialData={tour} onSave={handleSave} saving={saving} />
    </div>
  );
}
