'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import styles from './Carousel.module.css';

interface CarouselProps {
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  slideshow?: boolean;
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function Carousel({ children, headerActions, slideshow }: CarouselProps) {
  const locale = useLocale();
  const t = useTranslations('a11y');
  const isRtl = locale === 'ar';
  const childrenArray = React.Children.toArray(children);

  if (slideshow) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = childrenArray.length;

    const goTo = useCallback((index: number) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentIndex(index);
      }
    }, [totalSlides]);

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < totalSlides - 1;

    return (
      <div className={styles.carousel}>
        {headerActions && (
          <div className={styles.header}>
            {headerActions}
          </div>
        )}

        <div className={styles.slideshow}>
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={!canGoPrev}
            className={`${styles.slideshowArrow} ${styles.slideshowArrowPrev}`}
            aria-label={isRtl ? t('nextPage') : t('prevPage')}
          >
            <span style={{ display: 'inline-flex', transform: isRtl ? 'none' : 'scaleX(-1)' }}>
              <ArrowIcon />
            </span>
          </button>

          <div className={styles.slideshowViewport}>
            <div
              className={styles.slideshowTrack}
              style={{ transform: isRtl ? `translateX(${currentIndex * 100}%)` : `translateX(-${currentIndex * 100}%)` }}
            >
              {childrenArray.map((child, i) => (
                <div key={i} className={styles.slideshowSlide}>
                  {child}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={!canGoNext}
            className={`${styles.slideshowArrow} ${styles.slideshowArrowNext}`}
            aria-label={isRtl ? t('prevPage') : t('nextPage')}
          >
            <span style={{ display: 'inline-flex', transform: isRtl ? 'scaleX(-1)' : 'none' }}>
              <ArrowIcon />
            </span>
          </button>
        </div>

        <div className={styles.dots}>
          {childrenArray.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    const mq = window.matchMedia('(max-width: 640px)');
    const onMq = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    onMq(mq);
    mq.addEventListener('change', onMq);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
      mq.removeEventListener('change', onMq);
    };
  }, [updateScrollState]);

  const scroll = (direction: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const scrollAmount = card?.offsetWidth ?? 320;
    const gap = parseInt(getComputedStyle(el).gap) || 0;
    el.scrollBy({
      left: direction === 'next' ? scrollAmount + gap : -(scrollAmount + gap),
      behavior: 'smooth',
    });
  };

  const renderArrow = (dir: 'prev' | 'next', mobile: boolean) => (
    <button
      onClick={() => scroll(dir)}
      disabled={dir === 'prev' ? !canScrollPrev : !canScrollNext}
      className={`${mobile ? styles.mobileArrow : styles.arrow} ${dir === 'prev' ? (mobile ? styles.mobilePrev : styles.arrowPrev) : (mobile ? styles.mobileNext : styles.arrowNext)}`}
      aria-label={dir === 'prev' ? t('prevPage') : t('nextPage')}
    >
      <span style={{ display: 'inline-flex', transform: dir === 'prev' ? 'scaleX(-1)' : 'none' }}>
        <ArrowIcon />
      </span>
    </button>
  );

  return (
    <div className={styles.carousel}>
      {headerActions && (
        <div className={styles.header}>
          {renderArrow('prev', false)}
          {renderArrow('next', false)}
          {headerActions}
        </div>
      )}
      {renderArrow('prev', true)}
      <div className={styles.track} ref={trackRef}>
        {children}
      </div>
      {renderArrow('next', true)}
    </div>
  );
}
