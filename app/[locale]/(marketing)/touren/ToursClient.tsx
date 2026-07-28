'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Tour } from '@/lib/data/tours';
import Image from 'next/image';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import styles from './ToursClient.module.css';

interface DestinationOption {
  slug: string;
  name: string;
}

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
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type');

  const [draftDestination, setDraftDestination] = useState('');
  const [draftLocation, setDraftLocation] = useState('');
  const [draftSearch, setDraftSearch] = useState('');
  const [draftTypes, setDraftTypes] = useState<Set<string>>(
    () => initialType && TYPE_MAP[initialType] ? new Set([initialType]) : new Set()
  );
  const [draftDurations, setDraftDurations] = useState<Set<string>>(new Set());
  const [draftPriceMin, setDraftPriceMin] = useState('');
  const [draftPriceMax, setDraftPriceMax] = useState('');

  const [appliedDestination, setAppliedDestination] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedTypes, setAppliedTypes] = useState<Set<string>>(
    () => initialType && TYPE_MAP[initialType] ? new Set([initialType]) : new Set()
  );
  const [appliedDurations, setAppliedDurations] = useState<Set<string>>(new Set());
  const [appliedPriceMin, setAppliedPriceMin] = useState('');
  const [appliedPriceMax, setAppliedPriceMax] = useState('');

  const router = useRouter();

  const [sortBy, setSortBy] = useState('default');
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
    const params = new URLSearchParams(window.location.search);
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    router.replace(`${window.location.pathname}${qs ? '?' + qs : ''}`, { scroll: false });
  }, [page, router]);

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
    setAppliedDestination(draftDestination);
    setAppliedLocation(draftLocation);
    setAppliedSearch(draftSearch);
    setAppliedTypes(new Set(draftTypes));
    setAppliedDurations(new Set(draftDurations));
    setAppliedPriceMin(draftPriceMin);
    setAppliedPriceMax(draftPriceMax);
    setPage(1);
  }, [draftDestination, draftLocation, draftSearch, draftTypes, draftDurations, draftPriceMin, draftPriceMax]);

  const hasActiveFilters = appliedDestination !== '' || appliedLocation !== '' || appliedTypes.size > 0 || appliedDurations.size > 0 || appliedSearch.length > 0 || appliedPriceMin !== '' || appliedPriceMax !== '';

  const clearAllFilters = useCallback(() => {
    setDraftDestination('');
    setDraftLocation('');
    setDraftSearch('');
    setDraftTypes(new Set());
    setDraftDurations(new Set());
    setDraftPriceMin('');
    setDraftPriceMax('');
    setAppliedDestination('');
    setAppliedLocation('');
    setAppliedSearch('');
    setAppliedTypes(new Set());
    setAppliedDurations(new Set());
    setAppliedPriceMin('');
    setAppliedPriceMax('');
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    let result = [...tours];

    if (appliedDestination) {
      result = result.filter(tour => tour.destinationSlug === appliedDestination);
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
                value={draftLocation}
                onChange={e => setDraftLocation(e.target.value)}
              >
                <option value="">{t.allDestinations}</option>
                {destinations.filter(d => !['Kairo', 'Luxor', 'Marsa Alam', 'El Quseir'].includes(d.name)).map(d => (
                  <option key={d.slug} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.searchField}>
              <span className={styles.searchLabel}>{t.searchWhere}</span>
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
            <div className={styles.searchField}>
              <span className={styles.searchLabel}>{t.searchGuests}</span>
              <input
                type="number"
                min={1}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.searchBtn} aria-label={t.searchBtn} onClick={handleSearch}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>
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
