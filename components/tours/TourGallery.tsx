'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import styles from '@/app/[locale]/(marketing)/touren/[slug]/page.module.css';

export default function TourGallery({ images, name }: { images: string[]; name: string }) {
  const t = useTranslations('tours');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const validImages = images.filter((img) => img && img.startsWith('http'));
  if (validImages.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.galleryHero} style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius-card)' }} />
      </div>
    );
  }

  const hero = validImages[0];
  const thumbs = validImages.slice(1, 5);

  const imgLoader = (url: string) =>
    url.includes('cloudinary.com') ? cloudinaryLoader : undefined;

  return (
    <>
      <div className={styles.gallery}>
        <button className={styles.galleryHero} onClick={() => { setActiveIdx(0); setLightboxOpen(true); }}>
          <Image src={hero} alt={name} fill className={styles.galleryImg} priority sizes="(max-width: 768px) 100vw, 60vw" />
          <span className={styles.galleryAllPhotos}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            {validImages.length} {t('photos')}
          </span>
        </button>
        {thumbs.length > 0 && (
          <div className={styles.galleryThumbs}>
            {thumbs.map((img, i) => (
              <button key={i} className={styles.galleryThumb} onClick={() => { setActiveIdx(i + 1); setLightboxOpen(true); }}>
                <Image src={img} alt={`${name} ${i + 2}`} fill className={styles.galleryThumbImg} sizes="120px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <button className={styles.lightboxClose} onClick={() => setLightboxOpen(false)} aria-label={t('closeGallery')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image src={validImages[activeIdx]} alt={`${name} ${activeIdx + 1}`} fill className={styles.lightboxImg} sizes="90vw" />
            {validImages.length > 1 && (
              <>
                <button className={styles.lightboxPrev} onClick={() => setActiveIdx((activeIdx - 1 + validImages.length) % validImages.length)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rtl-flip"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button className={styles.lightboxNext} onClick={() => setActiveIdx((activeIdx + 1) % validImages.length)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rtl-flip"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <span className={styles.lightboxCounter}>{activeIdx + 1} / {validImages.length}</span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
