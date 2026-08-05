'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TourForm from '../TourForm';
import { useAdminLocale } from '../../AdminLanguageContext';

export default function NewTourPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const [saving, setSaving] = useState(false);

  async function handleSave(data: any) {
    setSaving(true);
    const res = await fetch('/api/admin/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newTour = await res.json();
      if (newTour?.id) {
        router.push(`/ZAIMOZ/tours/edit/${newTour.id}?created=1`);
      } else {
        alert(t('saveError'));
      }
    } else {
      alert(t('saveError'));
    }
    setSaving(false);
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link href="/ZAIMOZ/tours" style={{ fontSize: '14px', color: 'var(--color-accent)', textDecoration: 'none' }}>
          {t('backToTours')}
        </Link>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'var(--color-text-1)', marginTop: 'var(--space-3)' }}>
          {t('newTourTitle')}
        </h1>
      </div>
      <TourForm onSave={handleSave} saving={saving} />
    </div>
  );
}
