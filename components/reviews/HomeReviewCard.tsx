'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowUpRight, MapPin, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { TourReview } from '@/lib/data/reviews';
import styles from './Reviews.module.css';

interface HomeReviewCardProps {
  title: string | null;
  body: string;
  rating: ReactNode;
  footer: ReactNode;
  readMoreLabel: string;
  closeLabel: string;
  fullReviewLabel: string;
  tours: TourReview['tours'];
  toursLabel: string;
  moreToursLabel: string;
  viewAllToursLabel: string;
}

export default function HomeReviewCard({
  title,
  body,
  rating,
  footer,
  readMoreLabel,
  closeLabel,
  fullReviewLabel,
  tours,
  toursLabel,
  moreToursLabel,
  viewAllToursLabel,
}: HomeReviewCardProps) {
  const excerpt = useRef<HTMLQuoteElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const toursHeading = useRef<HTMLHeadingElement>(null);
  const openSection = useRef<'review' | 'tours'>('review');
  const [isTruncated, setIsTruncated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    const element = excerpt.current;
    if (!element) return;

    const measure = () => setIsTruncated(element.scrollHeight > element.clientHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [body]);

  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    if (!element) return;
    const triggerElement = trigger.current;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    if (openSection.current === 'tours') {
      toursHeading.current?.focus({ preventScroll: true });
      toursHeading.current?.scrollIntoView({ block: 'start' });
    } else {
      heading.current?.focus({ preventScroll: true });
    }

    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      triggerElement?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <>
      <article className={styles.homeReviewCard}>
        <div className={styles.homeCardTop}>
          {rating}
          <span className={styles.homeQuoteMark} aria-hidden="true">“</span>
        </div>
        {title && <h3 dir="auto">{title}</h3>}
        <div className={styles.homeReviewPreview}>
          <blockquote ref={excerpt} className={styles.homeReviewExcerpt} dir="auto">{body}</blockquote>
          {isTruncated && (
            <button
              type="button"
              className={styles.readFullReview}
              aria-haspopup="dialog"
              aria-controls={id}
              onClick={event => {
                trigger.current = event.currentTarget;
                openSection.current = 'review';
                setIsOpen(true);
              }}
            >
              {readMoreLabel}
            </button>
          )}
        </div>
        {footer}
        {tours.length > 0 && (
          <div className={styles.reviewTourPreview}>
            <p className={styles.reviewToursLabel}>{toursLabel}</p>
            <div className={styles.reviewTourChips}>
              {tours.slice(0, 2).map(tour => (
                <Link
                  key={tour.id}
                  className={styles.reviewTourChip}
                  href={`/touren/${tour.slug}`}
                  title={tour.name}
                  aria-label={tour.name}
                >
                  <MapPin size={13} aria-hidden="true" />
                  <span dir="auto">{tour.name.split(/\s+[–—|]\s+/u)[0]}</span>
                </Link>
              ))}
              {tours.length > 2 && (
                <button
                  type="button"
                  className={styles.moreReviewTours}
                  aria-label={viewAllToursLabel}
                  aria-haspopup="dialog"
                  aria-controls={id}
                  onClick={event => {
                    trigger.current = event.currentTarget;
                    openSection.current = 'tours';
                    setIsOpen(true);
                  }}
                >
                  <bdi>{moreToursLabel}</bdi>
                </button>
              )}
            </div>
          </div>
        )}
      </article>

      <dialog
        ref={dialog}
        id={id}
        className={styles.fullReviewDialog}
        aria-labelledby={`${id}-title`}
        onCancel={event => {
          event.preventDefault();
          setIsOpen(false);
        }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right ||
              event.clientY < bounds.top || event.clientY > bounds.bottom) {
            setIsOpen(false);
          }
        }}
      >
        {isOpen && (
          <>
            <div className={styles.fullReviewToolbar}>
              <span>{fullReviewLabel}</span>
              <button
                type="button"
                className={styles.closeFullReview}
                aria-label={closeLabel}
                onClick={() => setIsOpen(false)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className={styles.fullReviewContent}>
              {rating}
              <h2 ref={heading} id={`${id}-title`} tabIndex={-1} dir="auto">{title || fullReviewLabel}</h2>
              <blockquote dir="auto">{body}</blockquote>
              {footer}
              {tours.length > 0 && (
                <section className={styles.fullReviewTours} aria-labelledby={`${id}-tours`}>
                  <h3 ref={toursHeading} id={`${id}-tours`} tabIndex={-1}>
                    {toursLabel} <span>({tours.length})</span>
                  </h3>
                  <ul className={styles.fullReviewTourList}>
                    {tours.map(tour => (
                      <li key={tour.id}>
                        <Link className={styles.fullReviewTourLink} href={`/touren/${tour.slug}`}>
                          <span className={styles.reviewTourThumbnail} aria-hidden="true">
                            {tour.image ? (
                              <Image src={tour.image} alt="" width={60} height={60} sizes="60px" />
                            ) : <MapPin size={22} />}
                          </span>
                          <span dir="auto">{tour.name}</span>
                          <ArrowUpRight size={18} className={styles.reviewTourArrow} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
