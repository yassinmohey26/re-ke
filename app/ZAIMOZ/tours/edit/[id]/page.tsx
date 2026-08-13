'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TourForm from '../../TourForm';
import { useAdminLocale } from '../../../AdminLanguageContext';

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useAdminLocale();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreatedBanner, setShowCreatedBanner] = useState(
    () => searchParams.get('created') === '1',
  );

  function dismissCreatedBanner() {
    setShowCreatedBanner(false);
    router.replace(`/ZAIMOZ/tours/edit/${id}`, { scroll: false });
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/tours/${id}?locale=${locale}`)
      .then(r => r.json())
      .then(data => { setTour(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id, locale]);

  async function handleSave(data: any) {
    setSaving(true);
    const payload = { ...data, locale };
    const res = await fetch(`/api/admin/tours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
      {showCreatedBanner && (
        <div
          role="status"
          style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            color: '#16a34a',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: 'var(--space-4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <span>Tour created successfully! You can now add the itinerary below.</span>
          <button
            type="button"
            onClick={dismissCreatedBanner}
            aria-label="Dismiss"
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              padding: '0 4px',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      )}
      <TourForm key={locale} initialData={tour} onSave={handleSave} saving={saving} />
    </div>
  );
}
