import { getSupabaseAdmin } from '@/lib/supabase';
import {
  parseChildDiscountRow,
  resolveChildDiscounts,
  type TourChildDiscount,
} from '@/lib/child-discounts';

const db = getSupabaseAdmin();

export async function isTourSortOrderSupported(): Promise<boolean> {
  const { error } = await db.from('tours').select('sort_order').limit(1);
  if (error) {
    console.warn('[tours] sort_order column missing — using created_at ordering. Apply supabase/migrations/007_add_tours_sort_order.sql to enable manual tour ordering.');
    return false;
  }
  return true;
}

async function orderToursQuery<T>(query: T): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sorted = (query as any).order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false });
  const res = await sorted;
  if (res?.error && /sort_order/i.test(res.error.message)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (query as any).order('created_at', { ascending: false }) as T;
  }
  return sorted as T;
}


function stripZeroMinutes(d: string): string {
  return d.replace(/\s*0\s*(minutes?|Min\.?|minutes?)\s*/gi, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Formats a numeric duration (in hours) into a locale-appropriate string.
 * Tours with duration_hours >= 24 are rendered as day/night strings.
 */
export function formatDuration(hours: number, locale: string): string {
  if (!hours || hours <= 0) return '';

  if (hours >= 24) {
    if (hours === 24) {
      const map: Record<string, string> = {
        de: '1 Tag, 1 Nacht', en: '1 Day, 1 Night', ar: 'يوم وليلة',
        ru: '1 день, 1 ночь', fr: '1 jour, 1 nuit', hu: '1 nap, 1 éjszaka',
      };
      return map[locale] ?? '1 Day, 1 Night';
    }
    if (hours === 48) {
      const map: Record<string, string> = {
        de: '2 Tage, 1 Nacht', en: '2 Days, 1 Night', ar: 'يومان وليلة',
        ru: '2 дня, 1 ночь', fr: '2 jours, 1 nuit', hu: '2 nap, 1 éjszaka',
      };
      return map[locale] ?? '2 Days, 1 Night';
    }
  }

  switch (locale) {
    case 'de': return hours === 1 ? '1 Stunde' : `${hours} Stunden`;
    case 'en': return hours === 1 ? '1 Hour' : `${hours} Hours`;
    case 'ar':
      if (hours === 1) return 'ساعة واحدة';
      if (hours === 2) return 'ساعتان';
      if (hours >= 3 && hours <= 10) return `${hours} ساعات`;
      return `${hours} ساعة`;
    case 'ru': {
      const mod10 = hours % 10;
      const mod100 = hours % 100;
      if (mod10 === 1 && mod100 !== 11) return `${hours} час`;
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return `${hours} часа`;
      return `${hours} часов`;
    }
    case 'fr': return hours === 1 ? '1 heure' : `${hours} heures`;
    case 'hu': return `${hours} óra`;
    default:   return `${hours}h`;
  }
}

/**
 * Renders a localised meeting-point string from a template + pickup time slots.
 * German: appends " Uhr" to each slot (e.g. "08:30 Uhr oder 13:30 Uhr").
 * French:  converts HH:MM → HHhMM notation (e.g. "08h30").
 * Other locales: plain HH:MM slots joined by locale separator.
 */
export function formatMeetingPoint(
  template: string,
  timeSlots: string[],
  locale: string,
): string {
  if (!template) return '';
  if (!timeSlots || timeSlots.length === 0 || !template.includes('{time}')) {
    return template;
  }

  const formattedSlots = timeSlots.map((t) => {
    if (locale === 'de') return `${t} Uhr`;
    if (locale === 'fr') return t.replace(':', 'h');
    return t;
  });

  const separators: Record<string, string> = {
    de: ' oder ', en: ' or ', ar: ' أو ', ru: ' или ', fr: ' ou ', hu: ' vagy ',
  };
  const joined = formattedSlots.join(separators[locale] ?? ' or ');
  return template.replace(/\{time\}/g, joined);
}

export interface PricingTierEntry {
  min: number;
  max: number;
  price: number;
  vehicle?: 'sedan' | 'minibus' | 'speedboat' | 'boat';
}

export interface Discount {
  active: boolean;
  percentage: number;
  tierPrices?: number[];
  childTiers?: { label: string; price: string }[];
  pricingTiers?: PricingTierEntry[];
}

export interface Tour {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  /** Always the raw base-column (German) description — used to parse pricing tiers
   *  even when the display description is a translated version that lacks the HTML table. */
  rawDescription: string;
  price: number | null;
  duration: string;
  durationHours: number;
  maxGuests: number;
  difficulty: 'leicht' | 'mittel' | 'schwer';
  minAge: number;
  destination: string;
  destinationSlug: string;
  category: 'kultur' | 'schnorchel' | 'safari';
  categoryLabel: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { day?: string; title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  image: string;
  images: string[];
  meetingPoint: string;
  featured: boolean;
  discount: Discount | null;
  /** Age-based child pricing tiers (DB rows or runtime default fallback). */
  childDiscounts: TourChildDiscount[];
}

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface TourCategory {
  slug: string;
  label: string;
  category: Tour['category'];
  description: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TourExtra {
  id: string;
  name: string;
  description: string;
  price: number;
}

function parseStr(val: unknown, fallback: string): string {
  if (typeof val === 'string' && val.trim().length > 0) return val;
  return fallback;
}

function parseArr(val: unknown, fallback: string[]): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
  return fallback;
}

function parseItin(val: unknown, fallback: { title: string; content: string }[]): { title: string; content: string }[] {
  if (Array.isArray(val)) return val as { title: string; content: string }[];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed as { title: string; content: string }[];
    } catch {}
  }
  return fallback;
}

function parseImages(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter(v => typeof v === 'string' && v.startsWith('http'));
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter(v => typeof v === 'string' && v.startsWith('http'));
    } catch {}
    return val.startsWith('http') ? [val] : [];
  }
  return [];
}

function parseDiscount(val: unknown): Discount | null {
  if (!val) return null;
  if (typeof val === 'object' && val !== null) {
    const d = val as Record<string, unknown>;
    const pricingTiers = Array.isArray(d.pricingTiers)
      ? (d.pricingTiers as PricingTierEntry[])
      : undefined;
    if (d.active === true && typeof d.percentage === 'number') {
      return {
        active: true,
        percentage: d.percentage,
        tierPrices: Array.isArray(d.tierPrices) ? d.tierPrices.map(Number) : undefined,
        childTiers: Array.isArray(d.childTiers) ? d.childTiers : undefined,
        pricingTiers,
      };
    }
    return { active: false, percentage: 0, childTiers: Array.isArray(d.childTiers) ? d.childTiers : undefined, pricingTiers };
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return parseDiscount(parsed);
    } catch {}
  }
  return null;
}

function stripEmoji(s: string): string {
  return s.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\uFE0F]/gu, '').trim();
}

function parseFaqs(val: unknown, fallback: { question: string; answer: string }[]): { question: string; answer: string }[] {
  const source = Array.isArray(val) ? val : fallback;
  return source.map(item => {
    if (item.question && item.answer) return { question: stripEmoji(item.question), answer: item.answer };
    if (item.q && item.a) return { question: stripEmoji(item.q), answer: item.a };
    return { question: '', answer: '' };
  }).filter(item => item.question || item.answer);
}

function parseEavJoinedString(tr: any): any {
  if (!tr) return tr;
  if (tr.name && typeof tr.name === 'string' && tr.name.includes('---')) {
    const parts = tr.name.split(/---\s*تسيب\s*---/).map((p: string) => p.trim()).filter(Boolean);
    if (parts.length <= 1) return tr;

    tr.name = parts[0];
    tr.short_description = parts[1] || tr.short_description;

    let nextIdx = 2;

    // 1. Detect Category Label (typically very short, e.g. "الثقافة ومشاهدة المعالم السياحية", "الغطس وغوص", "Kultur & Sightseeing")
    if (parts[nextIdx] && parts[nextIdx].length < 60 && 
        (parts[nextIdx].includes('الثقافة') || parts[nextIdx].includes('الغطس') || parts[nextIdx].includes('مغامرة') || parts[nextIdx].includes('سفاري') || parts[nextIdx].includes('رياضة') || parts[nextIdx].includes('Kultur') || parts[nextIdx].includes('Ausflug') || parts[nextIdx].includes('Safari') || parts[nextIdx].includes('Wassersport') || parts[nextIdx].includes('Sightseeing'))) {
      tr.category_label = parts[nextIdx];
      nextIdx++;
    }

    // 2. Detect Meeting Point (e.g. "الغردقة - البحر الأحمر - مصر", "Hurghada - Rotes Meer")
    if (parts[nextIdx] && (parts[nextIdx].includes('الغردقة') || parts[nextIdx].includes('مصر') || parts[nextIdx].includes('البحر') || parts[nextIdx].includes('Hurghada') || parts[nextIdx].includes('Meer') || parts[nextIdx].includes('Aegypten') || parts[nextIdx].includes('Red Sea') || parts[nextIdx].includes('El Gouna') || parts[nextIdx].includes('الجونة'))) {
      tr.meeting_point = parts[nextIdx];
      nextIdx++;
    }

    // 3. Detect Duration (e.g. "14 ساعة", "3 ساعات", "يوم واحد", "14h", "3h", "Tag", "Stunde", "Stunden")
    if (parts[nextIdx] && (parts[nextIdx].includes('ساعة') || parts[nextIdx].includes('ساعات') || parts[nextIdx].includes('يوم') || parts[nextIdx].includes('Stunden') || parts[nextIdx].includes('Tag') || /^\d+\s*h$/i.test(parts[nextIdx]) || parts[nextIdx].includes('h') || parts[nextIdx].includes('Stunde') || parts[nextIdx].includes('Tage') || parts[nextIdx].includes('أيام') || parts[nextIdx].includes('مساءً'))) {
      tr.duration = parts[nextIdx];
      nextIdx++;
    }

    // 4. Detect Description (contains HTML tables or is long text)
    if (parts[nextIdx] && (parts[nextIdx].includes('<table') || parts[nextIdx].length > 100 || parts[nextIdx].includes('<p>') || parts[nextIdx].includes('<div>') || parts[nextIdx].includes('\n'))) {
      tr.description = parts[nextIdx];
      nextIdx++;
    }

    // 5. Gather remaining array parts (highlights, included, notIncluded, extra arrays)
    const arrays = [];
    while (nextIdx < parts.length) {
      if (parts[nextIdx].includes('---تقسيم---') || parts[nextIdx].includes('\n')) {
        const items = parts[nextIdx].split(/---\s*تقسيم\s*---/).map((s: string) => s.trim()).filter(Boolean);
        if (items.length > 0) {
          arrays.push(items);
        }
      } else {
        arrays.push([parts[nextIdx]]);
      }
      nextIdx++;
    }

    if (arrays[0]) tr.highlights = arrays[0];
    if (arrays[1]) tr.included = arrays[1];
    if (arrays[2]) tr.not_included = arrays[2];

    if (arrays[3] && arrays[4]) {
      const faqs = [];
      const qs = arrays[3];
      const as = arrays[4];
      for (let i = 0; i < Math.max(qs.length, as.length); i++) {
        faqs.push({ question: stripEmoji(qs[i] || ''), answer: as[i] || '' });
      }
      tr.faqs = faqs;
    }
  }
  return tr;
}

function parseDestinationEav(tr: any): any {
  if (!tr) return tr;
  if (tr.name && typeof tr.name === 'string' && tr.name.includes('---')) {
    const mainParts = tr.name.split(/---\s*تسيب\s*---/);
    if (mainParts.length > 1) {
      tr.name = mainParts[0].trim();
      tr.description = mainParts[1]?.trim() || tr.description;
    }
  }
  return tr;
}

function mergeTranslation(row: any, trRaw: any, locale: string = 'de'): Tour {
  const tr = parseEavJoinedString(trRaw);
  const unique = (arr: string[]) => [...new Set(arr)];

  // ── Structural fields: always sourced from `tours` base table ────────────
  // duration_hours is the single source of truth; format per-locale at render time.
  const durationHours: number = row.duration_hours ?? 0;
  const pickupSlots: string[] = Array.isArray(row.pickup_time_slots) ? row.pickup_time_slots : [];

  // For tours without a numeric duration_hours (legacy string-only tours), fall back
  // to the raw German string in the tours table — never from translations.
  const durationStr = durationHours > 0
    ? formatDuration(durationHours, locale)
    : stripZeroMinutes(row.duration ?? '');

  // Meeting point: render from template stored in content_translations (or tours base
  // for 'de') + structural time slots from tours.pickup_time_slots.
  const rawMeetingTemplate = locale === 'de'
    ? (row.meeting_point ?? '')
    : parseStr(tr?.meeting_point, row.meeting_point ?? '');
  const meetingPointStr = formatMeetingPoint(rawMeetingTemplate, pickupSlots, locale);

  return {
    id: row.id,
    slug: row.slug,
    name: parseStr(tr?.name, row.name),
    shortDescription: parseStr(tr?.short_description, row.short_description ?? ''),
    description: parseStr(tr?.description, row.description ?? ''),
    // rawDescription always points to the base DB column (German) so that
    // parsePricingTiers can find the HTML table regardless of the active locale.
    rawDescription: row.description ?? '',
    price: row.price,
    duration: durationStr,
    durationHours,
    maxGuests: row.max_guests ?? 8,
    difficulty: row.difficulty ?? 'leicht',
    minAge: row.min_age ?? 6,
    destination: row.destination ?? '',
    destinationSlug: row.destination_slug ?? '',
    category: row.category ?? 'kultur',
    categoryLabel: parseStr(tr?.category_label, row.category_label ?? ''),
    highlights: unique(parseArr(tr?.highlights, row.highlights ?? [])),
    included: unique(parseArr(tr?.included, row.included ?? [])),
    notIncluded: unique(parseArr(tr?.not_included, row.not_included ?? [])),
    itinerary: parseItin(tr?.itinerary ?? tr?.content, row.itinerary ?? []),
    faqs: parseFaqs(tr?.faqs, row.faqs ?? []),
    image: row.image ?? '',
    images: parseImages(row.image ?? ''),
    meetingPoint: meetingPointStr,
    featured: row.featured ?? false,
    discount: parseDiscount(row.discount ?? null),
    childDiscounts: [],
  };
}

function mergeDestinationTranslation(row: any, trRaw: any): Destination {
  const tr = parseDestinationEav(trRaw);
  return {
    slug: row.slug,
    name: parseStr(tr?.name, row.name),
    tagline: parseStr(tr?.tagline, row.tagline ?? ''),
    description: parseStr(tr?.description, row.description ?? ''),
    image: row.image ?? '',
  };
}

async function getTranslationsMap(
  tableName: string,
  rowIds: string[],
  locale: string,
): Promise<Map<string, any>> {
  if (rowIds.length === 0) return new Map();
  if (tableName === 'tours' && locale === 'de') return new Map();

  const map = new Map<string, any>();

  // Try requested locale first
  const { data } = await db
    .from('content_translations')
    .select('*')
    .eq('table_name', tableName)
    .eq('locale', locale)
    .in('row_id', rowIds);

  if (data) {
    for (const row of data) {
      map.set(row.row_id, row);
    }
  }

  // Fill in missing with 'de' fallback
  const missingIds = rowIds.filter(id => !map.has(id));
  if (missingIds.length > 0) {
    const { data: deData } = await db
      .from('content_translations')
      .select('*')
      .eq('table_name', tableName)
      .eq('locale', 'de')
      .in('row_id', missingIds);

    if (deData) {
      for (const row of deData) {
        map.set(row.row_id, row);
      }
    }

    const stillMissing = missingIds.filter(id => !map.has(id));
    if (stillMissing.length > 0) {
      console.warn(`[i18n] Missing ${locale} & de translations (${tableName}): ${stillMissing.length} rows — slugs: ${stillMissing.slice(0, 5).join(', ')}${stillMissing.length > 5 ? '...' : ''}`);
    }
  }

  return map;
}

async function getSingleTranslation(
  tableName: string,
  rowId: string,
  locale: string,
): Promise<any> {
  if (tableName === 'tours' && locale === 'de') return null;
  // Try requested locale
  const { data } = await db
    .from('content_translations')
    .select('*')
    .eq('table_name', tableName)
    .eq('row_id', rowId)
    .eq('locale', locale)
    .limit(1)
    .maybeSingle();

  if (data) return data;

  // Fallback to de
  const { data: deData } = await db
    .from('content_translations')
    .select('*')
    .eq('table_name', tableName)
    .eq('row_id', rowId)
    .eq('locale', 'de')
    .limit(1)
    .maybeSingle();

  if (!deData) {
    console.warn(`[i18n] Missing translation: table=${tableName} rowId=${rowId} locale=${locale} — falling back to base column values`);
  }

  return deData ?? null;
}

export async function getTours(locale: string = 'de'): Promise<Tour[]> {
  const { data: rows } = await orderToursQuery(db.from('tours').select('*'));
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('tours', rows.map(r => r.id), locale);
  return rows.map(row => mergeTranslation(row, trMap.get(row.id) ?? null, locale));
}

export async function getTourBySlug(slug: string, locale: string = 'de'): Promise<Tour | undefined> {
  const { data: row } = await db.from('tours').select('*').eq('slug', slug).single();
  if (!row) return undefined;

  const tr = await getSingleTranslation('tours', row.id, locale);
  const tour = mergeTranslation(row, tr, locale);
  const childDiscountRows = await getTourChildDiscountsFromDb(row.id);
  tour.childDiscounts = resolveChildDiscounts(childDiscountRows);

  // If the locale is not DE, also fetch the DE translation to extract rawDescription
  // (the pricing table HTML is always stored in the DE translation row).
  if (locale !== 'de') {
    const { data: deTr } = await db
      .from('content_translations')
      .select('description')
      .eq('table_name', 'tours')
      .eq('row_id', row.id)
      .eq('locale', 'de')
      .maybeSingle();
    if (deTr?.description) {
      tour.rawDescription = deTr.description;
    }
  }

  return tour;
}

export async function getTourChildDiscountsFromDb(tourId: string): Promise<TourChildDiscount[]> {
  const { data, error } = await db
    .from('tour_child_discounts')
    .select('*')
    .eq('tour_id', tourId)
    .order('sort_order', { ascending: true })
    .order('age_from', { ascending: true });

  if (error) {
    if (/tour_child_discounts/i.test(error.message)) {
      console.warn(
        '[tours] tour_child_discounts table missing — using default child pricing. Apply supabase/migrations/008_tour_child_discounts.sql.',
      );
      return [];
    }
    console.error('[tours] getTourChildDiscountsFromDb:', error.message);
    return [];
  }

  return (data ?? []).map((row) => parseChildDiscountRow(row as Record<string, unknown>));
}

export async function getTourExtras(tourId: string, locale: string = 'de'): Promise<TourExtra[]> {
  const { data } = await db
    .from('tour_extras')
    .select('*')
    .eq('tour_id', tourId)
    .eq('active', true)
    .order('sort_order', { ascending: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => {
    let name = row.name;
    let description = row.description ?? '';
    try {
      const translations = JSON.parse(row.description);
      if (translations[locale]) {
        name = translations[locale].name || name;
        description = translations[locale].description || '';
      } else if (translations['en']) {
        name = translations['en'].name || name;
        description = translations['en'].description || '';
      }
    } catch {
      // description is plain text (old format)
    }
    return {
      id: row.id,
      name,
      description,
      price: Number(row.price),
    };
  });
}

export async function getToursByCategory(category: Tour['category'], locale: string = 'de'): Promise<Tour[]> {
  const { data: rows } = await orderToursQuery(db.from('tours').select('*').eq('category', category));
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('tours', rows.map(r => r.id), locale);
  return rows.map(row => mergeTranslation(row, trMap.get(row.id) ?? null, locale));
}

export async function getToursByDestination(destinationSlug: string, locale: string = 'de'): Promise<Tour[]> {
  const { data: rows } = await orderToursQuery(db.from('tours').select('*').eq('destination_slug', destinationSlug));
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('tours', rows.map(r => r.id), locale);
  return rows.map(row => mergeTranslation(row, trMap.get(row.id) ?? null, locale));
}

export async function getFeaturedTours(locale: string = 'de'): Promise<Tour[]> {
  const { data: rows } = await orderToursQuery(db.from('tours').select('*').eq('featured', true));
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('tours', rows.map(r => r.id), locale);
  return rows.map(row => mergeTranslation(row, trMap.get(row.id) ?? null, locale));
}

export async function getDestinations(locale: string = 'de'): Promise<Destination[]> {
  const { data: rows } = await db.from('destinations').select('*').order('created_at', { ascending: true });
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('destinations', rows.map(r => r.id), locale);
  return rows.map(row => mergeDestinationTranslation(row, trMap.get(row.id) ?? null));
}

export async function getDestinationBySlug(slug: string, locale: string = 'de'): Promise<Destination | undefined> {
  const { data: row } = await db.from('destinations').select('*').eq('slug', slug).single();
  if (!row) return undefined;

  const tr = await getSingleTranslation('destinations', row.id, locale);
  return mergeDestinationTranslation(row, tr);
}

export async function getTourCategories(): Promise<TourCategory[]> {
  const { data } = await db.from('tour_categories').select('*').order('created_at', { ascending: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    slug: row.slug,
    label: row.label,
    category: row.category,
    description: row.description ?? '',
  }));
}

export async function getLocalizedTourName(slug: string, locale: string): Promise<string> {
  const tour = await getTourBySlug(slug, locale);
  if (!tour) return slug;
  return tour.name;
}

export async function getLocalizedTourShortDescription(slug: string, locale: string): Promise<string> {
  const tour = await getTourBySlug(slug, locale);
  if (!tour) return '';
  return tour.shortDescription;
}

export async function getLocalizedDestinationData(
  dest: Destination,
  locale: string,
): Promise<{ tagline: string; description: string; name: string }> {
  if (locale === 'de') return { tagline: dest.tagline, description: dest.description, name: dest.name };
  const localized = await getDestinationBySlug(dest.slug, locale);
  if (localized) return { tagline: localized.tagline, description: localized.description, name: localized.name };
  return { tagline: dest.tagline, description: dest.description, name: dest.name };
}

export async function getLocalizedCategoryLabel(slug: string, locale: string): Promise<string> {
  const cats = await getTourCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (cat) return cat.label;
  const fallback: Record<string, Record<string, string>> = {
    snorkel: { de: 'Schnorchel', en: 'Snorkeling', fr: 'Snorkeling', ru: 'Снорклинг', ar: 'سنوركلينغ', hu: 'Sznorkelezés' },
    schnorchel: { de: 'Schnorchel', en: 'Snorkeling', fr: 'Snorkeling', ru: 'Снорклинг', ar: 'سنوركلينغ', hu: 'Sznorkelezés' },
    kultur: { de: 'Kultur', en: 'Culture', fr: 'Culture', ru: 'Культура', ar: 'ثقافة', hu: 'Kultúra' },
    safari: { de: 'Safari', en: 'Safari', fr: 'Safari', ru: 'Сафари', ar: 'سفاري', hu: 'Szafari' },
  };
  return fallback[slug]?.[locale] ?? slug;
}

export async function getLocalizedTour(slug: string, locale: string): Promise<Tour | undefined> {
  return getTourBySlug(slug, locale);
}

export async function getLocalizedAllTours(locale: string): Promise<Tour[]> {
  return getTours(locale);
}
