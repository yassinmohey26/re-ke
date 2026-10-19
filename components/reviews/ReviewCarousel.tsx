'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './Reviews.module.css';

export default function ReviewCarousel({ children, previousLabel, nextLabel, label }: {
  children: ReactNode;
  previousLabel: string;
  nextLabel: string;
  label: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const id = useId();
  const [position, setPosition] = useState({ start: true, end: true });

  function measure() {
    const element = viewport.current;
    if (!element) return;
    const offset = Math.abs(element.scrollLeft);
    setPosition({ start: offset < 2, end: offset + element.clientWidth >= element.scrollWidth - 2 });
  }

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);

  function move(direction: number) {
    const element = viewport.current;
    if (!element) return;
    const rtl = getComputedStyle(element).direction === 'rtl';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({ left: direction * element.clientWidth * (rtl ? -1 : 1), behavior: reducedMotion ? 'instant' : 'smooth' });
  }

  return (
    <div>
      <div id={id} ref={viewport} className={styles.homeReviewGrid} onScroll={measure} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      {!(position.start && position.end) && (
        <div className={styles.carouselControls}>
          <button type="button" aria-controls={id} disabled={position.start} onClick={() => move(-1)}>{previousLabel}</button>
          <button type="button" aria-controls={id} disabled={position.end} onClick={() => move(1)}>{nextLabel}</button>
        </div>
      )}
    </div>
  );
}
