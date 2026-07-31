'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/i18n/navigation';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Tour } from '@/lib/data/tours';
import Image from 'next/image';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import styles from './ToursClient.module.css';

interface DestinationOption {
  slug: string;
  name: string;
}

const LONG_DISTANCE_SLUGS = [
  'privater-tagesausflug-von-hurghada-nach-kairo-pyramiden-grand-egyptian-museum',
  'kairo-mit-flug-ab-hurghada-pyramiden-museum',
  '2-tages-ausflug-nach-kairo-ab-hurghada-pyramiden-sphinx-aegyptische-geschichte-erleben',
  'luxor-tagesausflug-ab-hurghada',
  'luxor-tagesausflug-heissluftballon-hoteluebernachtung',
  'privater-pyramiden-ausflug-ab-hurghada-sakkara-dahschur-gizeh',
  'privater-tagesausflug-ab-hurghada-dendera-abydos-tempel',
  'dendera-halbtagesausflug-ab-hurghada-der-authentische-besuch-im-hathor-tempel',
  'kloester-st-antonius-st-paulus',
];

const SPECIAL_DEST_SLUGS = new Set(['el-quseir', 'marsa-alam', 'kairo']);

interface Props {
  tours: Tour[];
  locale: string;
  heroTitle?: string;
  heroImage?: string;
  destinations?: DestinationOption[];
  translations: {
    heroTitle: string;
    searchWhere: string;
    searchWhereLabel: string;
    searchWherePlaceholder: string;
    searchDate: string;
    searchGuests: string;
    searchBtn: string;
    filterPrice: string;
    filterTypes: string;
    filterDuration: string;
    clearFilters: string;
    sortBy: string;
    sortByDefault: string;
    sortByPriceAsc: string;
    sortByPriceDesc: string;
    sortByDurationAsc: string;
    sortByDurationDesc: string;
    toursFound: string;
    showing: string;
    of: string;
    page: string;
    prev: string;
    next: string;
    typeCultural: string;
    typeSnorkel: string;
    typeSafari: string;
    from: string;
    perPerson: string;
    hours: string;
    persons: string;
    allDestinations: string;
    inquiry: string;
    favorite: string;
    categoryCulturalDesc: string;
    categorySnorkelDesc: string;
    categorySafariDesc: string;
    viewTours: string;
  };
}

const PER_PAGE = 12;

const TYPE_MAP: Record<string, string[]> = {
  cultural: ['cultural', 'halbtag', 'ganztag', 'kultur'],
  snorkel: ['wassersport', 'snorkel', 'schnorchel'],
  safari: ['wuesten-safari', 'safari'],
};

const DURATION_MAP: Record<string, [number, number]> = {
  '4h': [0, 4],
  '7h': [4, 7],
  '8h': [7, 8],
  '12h': [8, 12],
  '15h': [12, Infinity],
};

export default function ToursClient({ tours, locale, heroTitle, heroImage, destinations = [], translations: t }: Props) {
  const tBook = useTranslations('booking');
  const searchParams = useSearchParams();

  const router = useRouter();

  function getInitParam(key: string): string {
    return searchParams.get(key) || '';
  }

  function getInitSet(key: string): Set<string> {
    return searchParams.get(key) ? new Set(searchParams.get(key)!.split(',')) : new Set();
  }

  const paramsDest = getInitParam('destination');
  const paramsTypes = getInitSet('type');
  const paramsDurations = getInitSet('duration');
  const paramsPriceMin = getInitParam('price_min');
  const paramsPriceMax = getInitParam('price_max');
  const paramsQ = getInitParam('q');
  const paramsOrderby = getInitParam('orderby');

  const [draftDestination, setDraftDestination] = useState(paramsDest);
  const [draftSearch, setDraftSearch] = useState(paramsQ);
  const [guestAdults, setGuestAdults] = useState(2);
  const [guestChildren, setGuestChildren] = useState(0);
  const [guestOpen, setGuestOpen] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [guestPos, setGuestPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [draftTypes, setDraftTypes] = useState<Set<string>>(() => new Set(paramsTypes));
  const [draftDurations, setDraftDurations] = useState<Set<string>>(() => new Set(paramsDurations));
  const [draftPriceMin, setDraftPriceMin] = useState(paramsPriceMin);
  const [draftPriceMax, setDraftPriceMax] = useState(paramsPriceMax);

  const [appliedDestination, setAppliedDestination] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedTypes, setAppliedTypes] = useState<Set<string>>(() => new Set(paramsTypes));
  const [appliedDurations, setAppliedDurations] = useState<Set<string>>(new Set());
  const [appliedPriceMin, setAppliedPriceMin] = useState('');
  const [appliedPriceMax, setAppliedPriceMax] = useState('');

  const [sortBy, setSortBy] = useState(paramsOrderby || 'default');
  const [page, setPageState] = useState(() => {
    const p = Number(searchParams.get('page'));
    return p > 0 ? p : 1;
  });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    types: true,
    duration: true,
  });

  const setPage = useCallback((p: number | ((prev: number) => number)) => {
    setPageState(p);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (appliedDestination) params.set('destination', appliedDestination);
    if (appliedTypes.size > 0) params.set('type', [...appliedTypes].join(','));
    if (appliedDurations.size > 0) params.set('duration', [...appliedDurations].join(','));
    if (appliedPriceMin) params.set('price_min', appliedPriceMin);
    if (appliedPriceMax) params.set('price_max', appliedPriceMax);
    if (appliedSearch) params.set('q', appliedSearch);
    if (sortBy !== 'default') params.set('orderby', sortBy);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.replace(`${window.location.pathname}${qs ? '?' + qs : ''}`, { scroll: false });
  }, [page, sortBy, appliedDestination, appliedSearch, appliedTypes, appliedDurations, appliedPriceMin, appliedPriceMax, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (guestRef.current && dropdownRef.current && !guestRef.current.contains(t) && !dropdownRef.current.contains(t)) {
        setGuestOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGuestOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const toggleGuest = useCallback(() => {
    if (guestOpen) {
      setGuestOpen(false);
      return;
    }
    const el = guestRef.current;
    if (el && !window.matchMedia('(max-width: 600px)').matches) {
      const r = el.getBoundingClientRect();
      setGuestPos({ top: r.bottom + 4, left: r.left, width: r.width });
    } else {
      setGuestPos(null);
    }
    setGuestOpen(true);
  }, [guestOpen]);

  useEffect(() => {
    if (!guestOpen || typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 600px)').matches) return;
    const update = () => {
      const el = guestRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setGuestPos({ top: r.bottom + 4, left: r.left, width: r.width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [guestOpen]);

  const toggleSection = useCallback((key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleDraftType = useCallback((key: string) => {
    setDraftTypes(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleDraftDuration = useCallback((key: string) => {
    setDraftDurations(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleSearch = useCallback(() => {
    setGuestOpen(false);
    setAppliedDestination(draftDestination);
    setAppliedSearch(draftSearch);
    setAppliedTypes(new Set(draftTypes));
    setAppliedDurations(new Set(draftDurations));
    setAppliedPriceMin(draftPriceMin);
    setAppliedPriceMax(draftPriceMax);
    setPage(1);
  }, [draftDestination, draftSearch, draftTypes, draftDurations, draftPriceMin, draftPriceMax]);

  const hasActiveFilters = appliedDestination !== '' || appliedTypes.size > 0 || appliedDurations.size > 0 || appliedSearch.length > 0 || appliedPriceMin !== '' || appliedPriceMax !== '';

  const clearAllFilters = useCallback(() => {
    setDraftDestination('');
    setDraftSearch('');
    setDraftTypes(new Set());
    setDraftDurations(new Set());
    setDraftPriceMin('');
    setDraftPriceMax('');
    setAppliedDestination('');
    setAppliedSearch('');
    setAppliedTypes(new Set());
    setAppliedDurations(new Set());
    setAppliedPriceMin('');
    setAppliedPriceMax('');
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    let result = [...tours];

    if (SPECIAL_DEST_SLUGS.has(appliedDestination)) {
      result = result.filter(tour => LONG_DISTANCE_SLUGS.includes(tour.slug));
    }

    if (appliedSearch) {
      const q = appliedSearch.toLowerCase();
      result = result.filter(
        tour =>
          tour.name.toLowerCase().includes(q) ||
          tour.destination.toLowerCase().includes(q) ||
          tour.categoryLabel.toLowerCase().includes(q)
      );
    }

    if (appliedTypes.size > 0) {
      const allowedCategories = new Set<string>();
      for (const key of appliedTypes) {
        const cats = TYPE_MAP[key];
        if (cats) cats.forEach(c => allowedCategories.add(c));
      }
      result = result.filter(tour => allowedCategories.has(tour.category));
    }

    if (appliedDurations.size > 0) {
      result = result.filter(tour => {
        const hours = tour.durationHours;
        for (const key of appliedDurations) {
          const range = DURATION_MAP[key];
          if (range && hours >= range[0] && hours < range[1]) return true;
        }
        return false;
      });
    }

    const minVal = appliedPriceMin !== '' ? parseFloat(appliedPriceMin) : null;
    const maxVal = appliedPriceMax !== '' ? parseFloat(appliedPriceMax) : null;
    if (minVal !== null || maxVal !== null) {
      result = result.filter(tour => {
        if (tour.price == null) return false;
        if (minVal !== null && tour.price < minVal) return false;
        if (maxVal !== null && tour.price > maxVal) return false;
        return true;
      });
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'duration-asc':
        result.sort((a, b) => a.durationHours - b.durationHours);
        break;
      case 'duration-desc':
        result.sort((a, b) => b.durationHours - a.durationHours);
        break;
    }

    return result;
  }, [tours, appliedSearch, appliedDestination, sortBy, appliedTypes, appliedDurations, appliedPriceMin, appliedPriceMax]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className={styles.wrapper}>
      {/* Hero */}
      <div className={styles.hero} style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{heroTitle || t.heroTitle}</h1>
          <div className={styles.searchBar}>
            <div className={styles.searchField}>
              <span className={styles.searchLabel}>{t.searchWhereLabel}</span>
              <select
                className={styles.searchInput}
                value={draftDestination}
                onChange={e => setDraftDestination(e.target.value)}
              >
                <option value="">{t.allDestinations}</option>
                {destinations.map(d => (
                  <option key={d.slug} value={d.slug}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.searchField}>
              <span className={styles.searchLabel}>{t.searchDate}</span>
              <input
                type="date"
                className={styles.searchInput}
              />
            </div>
            <div
              className={`${styles.searchField} ${styles.guestsField}${guestOpen ? ` ${styles.guestsFieldOpen}` : ''}`}
              ref={guestRef}
              style={{ position: 'relative' }}
            >
              <span className={styles.searchLabel}>{t.searchGuests}</span>
              <button
                type="button"
                className={styles.guestTrigger}
                onClick={toggleGuest}
                aria-haspopup="dialog"
                aria-expanded={guestOpen}
              >
                <span>{guestAdults + guestChildren} {t.persons}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: guestOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <button className={styles.searchBtn} aria-label={t.searchBtn} onClick={handleSearch}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
          {mounted && guestOpen && createPortal(
            <>
              <div className={styles.guestBackdrop} onClick={() => setGuestOpen(false)} />
              <div
                ref={dropdownRef}
                className={styles.guestDropdown}
                style={guestPos ? { position: 'fixed', top: guestPos.top, left: guestPos.left, width: guestPos.width } : undefined}
              >
                <div className={styles.guestRow}>
                  <span className={styles.guestLabel}>
                    <span>{tBook('adults')}</span>
                  </span>
                  <div className={styles.guestStepper} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button type="button" className={styles.guestBtn} onClick={() => setGuestAdults(Math.max(1, guestAdults - 1))}>−</button>
                    <span className={styles.guestValue}>{guestAdults}</span>
                    <button type="button" className={styles.guestBtn} onClick={() => setGuestAdults(guestAdults + 1)}>+</button>
                  </div>
                </div>
                <div className={styles.guestRow}>
                  <span className={styles.guestLabel}>
                    <span>{tBook('children')}</span>
                  </span>
                  <div className={styles.guestStepper} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button type="button" className={styles.guestBtn} onClick={() => setGuestChildren(Math.max(0, guestChildren - 1))}>−</button>
                    <span className={styles.guestValue}>{guestChildren}</span>
                    <button type="button" className={styles.guestBtn} onClick={() => setGuestChildren(guestChildren + 1)}>+</button>
                  </div>
                </div>
                <button type="button" className={styles.guestDone} onClick={() => setGuestOpen(false)}>Fertig</button>
              </div>
            </>,
            document.body
          )}
        </div>
        {destinations.length > 0 && (
          <div className={styles.destChips}>
            {destinations.map(d => {
              const isActive = appliedDestination === d.slug;
              return (
                <button
                  key={d.slug}
                  className={`${styles.destChip} ${isActive ? styles.destChipActive : ''}`}
                  onClick={() => {
                    if (isActive) {
                      setDraftDestination('');
                      setAppliedDestination('');
                    } else {
                      setDraftDestination(d.slug);
                      setAppliedDestination(d.slug);
                    }
                    setPage(1);
                  }}
                >
                  {d.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Cards */}
      <div className={styles.categories}>
        <div className={styles.categoriesInner}>
          <button
            className={styles.categoryCard}
            onClick={() => { toggleDraftType('cultural'); handleSearch(); }}
          >
            <Image
              src="https://res.cloudinary.com/sx85slkf/image/upload/v1784360310/hurghada-reiseplaner/tours/vqqsp7ra8teoydmm6yfn.jpg"
              alt={t.typeCultural}
              className={styles.categoryImg}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              loader={cloudinaryLoader}
            />
            <div className={styles.categoryOverlay} />
            <div className={styles.categoryContent}>
              <h3 className={styles.categoryTitle}>{t.typeCultural}</h3>
              <p className={styles.categoryDesc}>{t.categoryCulturalDesc}</p>
              <span className={styles.categoryBtn}>{t.viewTours}</span>
            </div>
          </button>
          <button
            className={styles.categoryCard}
            onClick={() => { toggleDraftType('snorkel'); handleSearch(); }}
          >
            <Image
              src="https://res.cloudinary.com/sx85slkf/image/upload/v1784552895/hurghada-reiseplaner/tours/ittvyyrxy2bdegnpu7x7.jpg"
              alt={t.typeSnorkel}
              className={styles.categoryImg}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              loader={cloudinaryLoader}
            />
            <div className={styles.categoryOverlay} />
            <div className={styles.categoryContent}>
              <h3 className={styles.categoryTitle}>{t.typeSnorkel}</h3>
              <p className={styles.categoryDesc}>{t.categorySnorkelDesc}</p>
              <span className={styles.categoryBtn}>{t.viewTours}</span>
            </div>
          </button>
          <button
            className={styles.categoryCard}
            onClick={() => { toggleDraftType('safari'); handleSearch(); }}
          >
            <Image
              src="https://res.cloudinary.com/sx85slkf/image/upload/v1784566865/hurghada-reiseplaner/tours/ppnoc8ywf1n43zu4ophl.jpg"
              alt={t.typeSafari}
              className={styles.categoryImg}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              loader={cloudinaryLoader}
            />
            <div className={styles.categoryOverlay} />
            <div className={styles.categoryContent}>
              <h3 className={styles.categoryTitle}>{t.typeSafari}</h3>
              <p className={styles.categoryDesc}>{t.categorySafariDesc}</p>
              <span className={styles.categoryBtn}>{t.viewTours}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <FilterSection
            title={t.filterTypes}
            open={openSections.types}
            onToggle={() => toggleSection('types')}
          >
            <CheckboxItem label={t.typeCultural} checked={draftTypes.has('cultural')} onChange={() => toggleDraftType('cultural')} />
            <CheckboxItem label={t.typeSnorkel} checked={draftTypes.has('snorkel')} onChange={() => toggleDraftType('snorkel')} />
            <CheckboxItem label={t.typeSafari} checked={draftTypes.has('safari')} onChange={() => toggleDraftType('safari')} />
          </FilterSection>

          <FilterSection
            title={t.filterDuration}
            open={openSections.duration}
            onToggle={() => toggleSection('duration')}
          >
            <CheckboxItem label="0–4 h" checked={draftDurations.has('4h')} onChange={() => toggleDraftDuration('4h')} />
            <CheckboxItem label="4–7 h" checked={draftDurations.has('7h')} onChange={() => toggleDraftDuration('7h')} />
            <CheckboxItem label="7–8 h" checked={draftDurations.has('8h')} onChange={() => toggleDraftDuration('8h')} />
            <CheckboxItem label="8–12 h" checked={draftDurations.has('12h')} onChange={() => toggleDraftDuration('12h')} />
            <CheckboxItem label="12+ h" checked={draftDurations.has('15h')} onChange={() => toggleDraftDuration('15h')} />
          </FilterSection>

          <FilterSection
            title={t.filterPrice}
            open={openSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className={styles.priceRange}>
              <div className={styles.priceField}>
                <span className={styles.priceFieldLabel}>€ Min</span>
                <input
                  type="number"
                  min={0}
                  className={styles.priceInput}
                  value={draftPriceMin}
                  onChange={e => setDraftPriceMin(e.target.value)}
                />
              </div>
              <span className={styles.priceDash}>–</span>
              <div className={styles.priceField}>
                <span className={styles.priceFieldLabel}>€ Max</span>
                <input
                  type="number"
                  min={0}
                  className={styles.priceInput}
                  value={draftPriceMax}
                  onChange={e => setDraftPriceMax(e.target.value)}
                />
              </div>
            </div>
          </FilterSection>
        </aside>

        {/* Right content */}
        <div className={styles.content}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <span className={styles.resultCount}>
                {filtered.length} {t.toursFound}
              </span>
              {hasActiveFilters && (
                <button className={styles.clearBtn} onClick={clearAllFilters}>
                  {t.clearFilters}
                </button>
              )}
            </div>
            <div className={styles.toolbarRight}>
              <label className={styles.sortLabel}>{t.sortBy}:</label>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setPage(1); }}
              >
                <option value="default">{t.sortByDefault}</option>
                <option value="price-asc">{t.sortByPriceAsc}</option>
                <option value="price-desc">{t.sortByPriceDesc}</option>
                <option value="duration-asc">{t.sortByDurationAsc}</option>
                <option value="duration-desc">{t.sortByDurationDesc}</option>
              </select>
            </div>
          </div>

          {/* Card grid */}
          {paged.length === 0 ? (
            <p className={styles.noResults}>{t.showing} 0 {t.toursFound}</p>
          ) : (
            <div className={styles.grid}>
              {paged.map(tour => (
                <Link key={tour.slug} href={`/touren/${tour.slug}`} className={styles.card}>
                  <div className={styles.cardImgWrap}>
                    {tour.images?.[0] && (
                      <Image
                        src={tour.images[0]}
                        alt={tour.name}
                        className={styles.cardImg}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                        loader={tour.images[0].includes('cloudinary.com') ? cloudinaryLoader : undefined}
                      />
                    )}
                    {tour.discount?.active && (
                      <span className={styles.saleBadge}>-{tour.discount.percentage}%</span>
                    )}
                    <button className={styles.heartBtn} aria-label={t.favorite} onClick={e => e.preventDefault()}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardLocation}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {tour.destination || 'Hurghada'}
                    </p>
                    <h3 className={styles.cardTitle}>{tour.name}</h3>
                    <div className={styles.cardMeta}>
                      <span className={styles.metaItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {tour.duration || `${tour.durationHours} ${t.hours}`}
                      </span>
                      <span className={styles.metaItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        0–{tour.maxGuests} {t.persons}
                      </span>
                    </div>
                    <div className={styles.cardPrice}>
                      {tour.price != null ? (
                        tour.discount?.active ? (
                          <>
                            <span className={styles.priceLabel}>{t.from} </span>
                            <span className={styles.oldPrice}>€{tour.price.toFixed(2)}</span>{' '}
                            <span className={styles.salePrice}>€{Math.round(tour.price * (1 - tour.discount.percentage / 100)).toFixed(2)}</span>
                            <span className={styles.priceUnit}> /{t.perPerson}</span>
                          </>
                        ) : (
                          <>
                            <span className={styles.priceLabel}>{t.from} </span>
                            <span className={styles.priceValue}>€{tour.price.toFixed(2)}</span>
                            <span className={styles.priceUnit}> /{t.perPerson}</span>
                          </>
                        )
                      ) : (
                        <span className={styles.priceLabel}>{t.from} {t.inquiry}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                {t.prev}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                {t.next}
              </button>
            </div>
          )}
          <p className={styles.paginationInfo}>
            {t.showing} {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} {t.of} {filtered.length} {t.toursFound}
          </p>
        </div>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.filterSection}>
      <button className={styles.filterHeader} onClick={onToggle}>
        <span>{title}</span>
        <svg
          width="12" height="7" viewBox="0 0 12 7" fill="none"
          className={open ? styles.chevronOpen : styles.chevron}
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && <div className={styles.filterBody}>{children}</div>}
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={styles.checkboxItem}>
      <input
        type="checkbox"
        className={styles.checkboxInput}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkboxMark} />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  );
}
