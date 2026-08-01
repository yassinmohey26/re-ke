'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdminLocale } from '../AdminLanguageContext';
import GalleryUpload from '@/components/admin/GalleryUpload';
import ExtrasManager from './ExtrasManager';
import { parsePricingTiers, stripPricingTable, buildPricingTable } from '@/lib/pricing-table';
import type { PricingTier } from '@/lib/pricing-table';
import type { Discount } from '@/lib/data/tours';
import styles from './TourForm.module.css';

interface TourFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

function parseImageField(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(v => typeof v === 'string' && v.startsWith('http'));
  if (typeof val === 'string') {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter(v => typeof v === 'string' && v.startsWith('http'));
    } catch {}
    return val.startsWith('http') ? [val] : [];
  }
  return [];
}

const EMPTY_TIER: PricingTier = { minGuests: 1, maxGuests: 1, pricePerPerson: 0 };

export default function TourForm({ initialData, onSave, saving }: TourFormProps) {
  const { t, locale } = useAdminLocale();

  function tr(field: string): any {
    return initialData?.translations?.[locale]?.[field] ?? initialData?.[field] ?? initialData?.[field.replace(/_/g, '')] ?? '';
  }

  const [form, setForm] = useState({
    slug: initialData?.slug || '',
    name: tr('name') || '',
    shortDescription: tr('short_description') || '',
    description: tr('description') || '',
    price: initialData?.price ?? '',
    duration: tr('duration') || '',
    durationHours: initialData?.durationHours || initialData?.duration_hours || 4,
    maxGuests: initialData?.maxGuests || initialData?.max_guests || 8,
    difficulty: initialData?.difficulty || 'leicht',
    minAge: initialData?.minAge || initialData?.min_age || 4,
    destination: initialData?.destination || '',
    destinationSlug: initialData?.destinationSlug || initialData?.destination_slug || 'hurghada',
    category: initialData?.category || 'kultur',
    categoryLabel: tr('category_label') || '',
    highlights: (tr('highlights') || []).join('\n'),
    included: (tr('included') || []).join('\n'),
    notIncluded: (tr('not_included') || []).join('\n'),
    meetingPoint: tr('meeting_point') || '',
    featured: initialData?.featured || false,
    active: initialData?.active !== false,
  });

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(() => {
    // 1. First try parsing from description HTML (legacy: table was appended by buildPricingTable)
    const baseDesc =
      initialData?.rawDescription ||
      initialData?.translations?.de?.description ||
      initialData?.description ||
      tr('description') ||
      '';
    const fromDesc = parsePricingTiers(baseDesc);
    if (fromDesc.length > 0) return fromDesc;

    // 2. Fallback: read from discount.pricingTiers JSON column
    // The public tour page stores/reads pricing tiers here when no HTML table exists.
    const discountTiers = initialData?.discount?.pricingTiers;
    if (Array.isArray(discountTiers) && discountTiers.length > 0) {
      return discountTiers.map((t: any) => ({
        minGuests: Number(t.min ?? t.minGuests ?? 1),
        maxGuests: Number(t.max ?? t.maxGuests ?? 1),
        pricePerPerson: Number(t.price ?? t.pricePerPerson ?? 0),
      }));
    }

    return [];
  });

  function parseDiscountInit(val: unknown): Discount {
    if (!val) return { active: false, percentage: 0 };
    if (typeof val === 'object' && val !== null) {
      const d = val as Discount;
      return {
        active: d.active === true,
        percentage: d.percentage ?? 0,
        tierPrices: d.tierPrices,
        pricingTiers: d.pricingTiers, // preserve so it survives a save roundtrip
      };
    }
    return { active: false, percentage: 0 };
  }

  const [discount, setDiscount] = useState<Discount>(() => parseDiscountInit(initialData?.discount));
  const [showDiscount, setShowDiscount] = useState(() => discount.active);

  const [images, setImages] = useState<string[]>(() => {
    return parseImageField(initialData?.image);
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

  function updateTier(index: number, field: keyof PricingTier, value: number) {
    setPricingTiers(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addTier() {
    setPricingTiers(prev => [...prev, { ...EMPTY_TIER, minGuests: prev.length > 0 ? prev[prev.length - 1].maxGuests + 1 : 1 }]);
  }

  function removeTier(index: number) {
    setPricingTiers(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let description = stripPricingTable(form.description);
    if (pricingTiers.length > 0) {
      description = description + '\n' + buildPricingTable(pricingTiers);
    }

    // Always persist pricingTiers in the discount JSON column so the public
    // tour page can find them even when description HTML parsing fails.
    const pricingTierEntries = pricingTiers.map(t => ({
      min: t.minGuests,
      max: t.maxGuests,
      price: t.pricePerPerson,
    }));

    let discountToSave: Discount | null = null;
    if (showDiscount && discount.active) {
      discountToSave = { ...discount, pricingTiers: pricingTierEntries };
    } else if (pricingTierEntries.length > 0) {
      // No active discount but we still need to persist pricing tiers
      discountToSave = { active: false, percentage: 0, pricingTiers: pricingTierEntries };
    }

    const data = {
      ...form,
      description,
      price: form.price === '' || form.price === null ? null : Number(form.price),
      discount: discountToSave,
      durationHours: Number(form.durationHours),
      maxGuests: Number(form.maxGuests),
      minAge: Number(form.minAge),
      highlights: form.highlights.split('\n').filter((s: string) => s.trim()),
      included: form.included.split('\n').filter((s: string) => s.trim()),
      notIncluded: form.notIncluded.split('\n').filter((s: string) => s.trim()),
      image: images.length > 0 ? JSON.stringify(images) : '',
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
              <option value="kultur">{t('catKultur')}</option>
              <option value="schnorchel">{t('catSchnorchel')}</option>
              <option value="safari">{t('catSafari')}</option>
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
        <h2 className={styles.sectionTitle}>Preise pro Person (Gruppengröße)</h2>
        <p style={{ fontSize: '12px', color: 'var(--color-text-3)', marginBottom: 'var(--space-3)' }}>
          Lege fest, wie viel pro Person für verschiedene Gruppengrößen gezahlt wird.
        </p>
        {pricingTiers.length > 0 && (
          <div className={styles.pricingTable}>
            <div className={styles.pricingHeader}>
              <span>Personen</span>
              <span>Preis pro Person (€)</span>
              <span></span>
            </div>
            {pricingTiers.map((tier, i) => (
              <div key={i} className={styles.pricingRow}>
                <div className={styles.pricingRange}>
                  <input
                    type="number"
                    min="1"
                    className={styles.pricingInput}
                    value={tier.minGuests}
                    onChange={e => updateTier(i, 'minGuests', Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <span className={styles.pricingDash}>–</span>
                  <input
                    type="number"
                    min="1"
                    className={styles.pricingInput}
                    value={tier.maxGuests}
                    onChange={e => updateTier(i, 'maxGuests', Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  className={styles.pricingPrice}
                  value={tier.pricePerPerson}
                  onChange={e => updateTier(i, 'pricePerPerson', Math.max(0, parseInt(e.target.value) || 0))}
                />
                <button type="button" className={styles.removeTierBtn} onClick={() => removeTier(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="button" className={styles.addTierBtn} onClick={addTier}>
          + Preisstufe hinzufügen
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Rabatt / Sale</h2>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" checked={showDiscount} onChange={e => { setShowDiscount(e.target.checked); if (!e.target.checked) setDiscount({ active: false, percentage: 0 }); }} />
          <span>Rabatt aktivieren</span>
        </label>
        {showDiscount && (
          <div className={styles.discountEditor}>
            <div className={styles.field}>
              <label className={styles.label}>Rabatt in %</label>
              <input className={styles.input} type="number" min="0" max="100" value={discount.percentage} onChange={e => setDiscount(prev => ({ ...prev, active: true, percentage: parseInt(e.target.value) || 0 }))} />
            </div>
            {pricingTiers.length > 0 && (
              <>
                <p style={{ fontSize: '12px', color: 'var(--color-text-3)', margin: 'var(--space-3) 0' }}>
                  Optional: Überschreibe den reduzierten Preis pro Preisstufe (lassen leer für automatische Berechnung).
                </p>
                <div className={styles.pricingTable}>
                  <div className={styles.pricingHeader}>
                    <span>Preisstufe</span>
                    <span>Aktionspreis (€)</span>
                    <span></span>
                  </div>
                  {pricingTiers.map((tier, i) => (
                    <div key={i} className={styles.pricingRow}>
                      <span style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>
                        {tier.minGuests}–{tier.maxGuests} Personen · {tier.pricePerPerson}€
                      </span>
                      <input
                        type="number"
                        min="0"
                        className={styles.pricingPrice}
                        value={discount.tierPrices?.[i] ?? ''}
                        onChange={e => {
                          const val = e.target.value === '' ? undefined : parseInt(e.target.value) || 0;
                          setDiscount(prev => {
                            const tp = [...(prev.tierPrices ?? [])];
                            tp[i] = val ?? 0;
                            return { ...prev, active: true, tierPrices: tp };
                          });
                        }}
                        placeholder="Auto"
                      />
                      <button type="button" className={styles.removeTierBtn} onClick={() => {
                        setDiscount(prev => {
                          const tp = [...(prev.tierPrices ?? [])];
                          delete tp[i];
                          return { ...prev, tierPrices: tp.filter(v => v !== undefined) };
                        });
                      }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('tourImage')} / Galerie</h2>
        <div className={styles.field}>
          <GalleryUpload
            values={images}
            onChange={setImages}
            folder="hurghada-reiseplaner/tours"
            label="Bilder (Galerie)"
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
