'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdminLocale } from '../AdminLanguageContext';
import ImageUpload from '@/components/admin/ImageUpload';
import ExtrasManager from './ExtrasManager';
import styles from './TourForm.module.css';

interface TourFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

export default function TourForm({ initialData, onSave, saving }: TourFormProps) {
  const { t } = useAdminLocale();

  const [form, setForm] = useState({
    slug: initialData?.slug || '',
    name: initialData?.name || '',
    shortDescription: initialData?.shortDescription || initialData?.short_description || '',
    description: initialData?.description || '',
    price: initialData?.price ?? '',
    duration: initialData?.duration || '',
    durationHours: initialData?.durationHours || initialData?.duration_hours || 4,
    maxGuests: initialData?.maxGuests || initialData?.max_guests || 8,
    difficulty: initialData?.difficulty || 'leicht',
    minAge: initialData?.minAge || initialData?.min_age || 4,
    destination: initialData?.destination || '',
    destinationSlug: initialData?.destinationSlug || initialData?.destination_slug || 'hurghada',
    category: initialData?.category || 'halbtag',
    categoryLabel: initialData?.categoryLabel || initialData?.category_label || '',
    highlights: (initialData?.highlights || []).join('\n'),
    included: (initialData?.included || []).join('\n'),
    notIncluded: (initialData?.notIncluded || initialData?.not_included || []).join('\n'),
    image: initialData?.image || '',
    meetingPoint: initialData?.meetingPoint || initialData?.meeting_point || '',
    featured: initialData?.featured || false,
    active: initialData?.active !== false,
  });

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function generateSlug() {
    const slug = form.name
      .toLowerCase()
      .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/[ß]/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    update('slug', slug);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      ...form,
      price: form.price === '' || form.price === null ? null : Number(form.price),
      durationHours: Number(form.durationHours),
      maxGuests: Number(form.maxGuests),
      minAge: Number(form.minAge),
      highlights: form.highlights.split('\n').filter((s: string) => s.trim()),
      included: form.included.split('\n').filter((s: string) => s.trim()),
      notIncluded: form.notIncluded.split('\n').filter((s: string) => s.trim()),
      gallery: initialData?.gallery || [],
      itinerary: initialData?.itinerary || [],
      faqs: initialData?.faqs || [],
    };
    await onSave(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('tourBasics')}</h2>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourName')}</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input className={styles.input} value={form.name} onChange={e => update('name', e.target.value)} required />
              <button type="button" onClick={generateSlug} className={styles.slugBtn}>Slug</button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourSlug')}</label>
            <input className={styles.input} value={form.slug} onChange={e => update('slug', e.target.value)} required />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t('tourShortDesc')}</label>
          <input className={styles.input} value={form.shortDescription} onChange={e => update('shortDescription', e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t('tourFullDesc')}</label>
          <textarea className={styles.textarea} rows={4} value={form.description} onChange={e => update('description', e.target.value)} />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('tourDetails')}</h2>
        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourPrice')}</label>
            <input className={styles.input} type="number" min="0" value={form.price ?? ''} onChange={e => update('price', e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourDuration')}</label>
            <input className={styles.input} value={form.duration} onChange={e => update('duration', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourDurationHours')}</label>
            <input className={styles.input} type="number" min="1" value={form.durationHours} onChange={e => update('durationHours', e.target.value)} />
          </div>
        </div>
        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourMaxGuests')}</label>
            <input className={styles.input} type="number" min="1" value={form.maxGuests} onChange={e => update('maxGuests', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourDifficulty')}</label>
            <select className={styles.input} value={form.difficulty} onChange={e => update('difficulty', e.target.value)}>
              <option value="leicht">{t('diffEasy')}</option>
              <option value="mittel">{t('diffMedium')}</option>
              <option value="schwer">{t('diffHard')}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourMinAge')}</label>
            <input className={styles.input} type="number" min="0" value={form.minAge} onChange={e => update('minAge', e.target.value)} />
          </div>
        </div>
        <div className={styles.row3}>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourCategory')}</label>
            <select className={styles.input} value={form.category} onChange={e => update('category', e.target.value)}>
              <option value="ganztag">{t('catGanztag')}</option>
              <option value="halbtag">{t('catHalbtag')}</option>
              <option value="wassersport">{t('catWassersport')}</option>
              <option value="wuesten-safari">{t('catWuesten')}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourDestination')}</label>
            <input className={styles.input} value={form.destination} onChange={e => update('destination', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourMeetingPoint')}</label>
            <input className={styles.input} value={form.meetingPoint} onChange={e => update('meetingPoint', e.target.value)} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('tourImage')}</h2>
        <div className={styles.field}>
          <ImageUpload
            value={form.image}
            onChange={(url) => update('image', url)}
            folder="hurghada-reiseplaner/tours"
            label={t('tourImageUrl')}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('tourLists')}</h2>
        <div className={styles.field}>
          <label className={styles.label}>{t('tourHighlights')}</label>
          <textarea className={styles.textarea} rows={4} value={form.highlights} onChange={e => update('highlights', e.target.value)} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourIncluded')}</label>
            <textarea className={styles.textarea} rows={4} value={form.included} onChange={e => update('included', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('tourNotIncluded')}</label>
            <textarea className={styles.textarea} rows={4} value={form.notIncluded} onChange={e => update('notIncluded', e.target.value)} />
          </div>
        </div>
      </div>

      {initialData?.id && (
        <ExtrasManager tourId={initialData.id} styles={styles} />
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('tourStatus')}</h2>
        <div className={styles.row}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} />
            <span>{t('tourFeatured')}</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={form.active} onChange={e => update('active', e.target.checked)} />
            <span>{t('tourActive')}</span>
          </label>
        </div>
      </div>

      <div className={styles.formActions}>
        <Link href="/ZAIMOZ/tours" className={styles.cancelBtn}>{t('tourCancel')}</Link>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? t('tourSave') : initialData ? t('tourUpdate') : t('tourCreate')}
        </button>
      </div>
    </form>
  );
}
