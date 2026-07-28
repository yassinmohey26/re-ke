import { getSupabaseAdmin } from '@/lib/supabase';

const db = getSupabaseAdmin();

function stripZeroMinutes(d: string): string {
  return d.replace(/\s*0\s*(minutes?|Min\.?|minutes?)\s*/gi, ' ').replace(/\s{2,}/g, ' ').trim();
}

export interface Discount {
  active: boolean;
  percentage: number;
  tierPrices?: number[];
}

export interface Tour {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
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
  if (typeof val === 'string') return val;
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
    if (d.active === true && typeof d.percentage === 'number') {
      return {
        active: true,
        percentage: d.percentage,
        tierPrices: Array.isArray(d.tierPrices) ? d.tierPrices.map(Number) : undefined,
      };
    }
    return { active: false, percentage: 0 };
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
  if (!Array.isArray(val)) return fallback;
  return val.map(item => {
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

function mergeTranslation(row: any, trRaw: any): Tour {
  const tr = parseEavJoinedString(trRaw);
  const unique = (arr: string[]) => [...new Set(arr)];
  return {
    id: row.id,
    slug: row.slug,
    name: parseStr(tr?.name, row.name),
    shortDescription: parseStr(tr?.short_description, row.short_description ?? ''),
    description: parseStr(tr?.description, row.description ?? ''),
    price: row.price,
    duration: stripZeroMinutes(parseStr(tr?.duration, row.duration ?? '')),
    durationHours: row.duration_hours ?? 0,
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
    meetingPoint: parseStr(tr?.meeting_point, row.meeting_point ?? ''),
    featured: row.featured ?? false,
    discount: parseDiscount(row.discount ?? null),
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
  if (missingIds.length > 0 && locale !== 'de') {
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
  }

  return map;
}

async function getSingleTranslation(
  tableName: string,
  rowId: string,
  locale: string,
): Promise<any> {
  if (locale === 'de') {
    const { data } = await db
      .from('content_translations')
      .select('*')
      .eq('table_name', tableName)
      .eq('row_id', rowId)
      .eq('locale', 'de')
      .limit(1)
      .maybeSingle();
    return data ?? null;
  }

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

  return deData ?? null;
}

export async function getTours(locale: string = 'de'): Promise<Tour[]> {
  const { data: rows } = await db.from('tours').select('*').order('created_at', { ascending: false });
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('tours', rows.map(r => r.id), locale);
  return rows.map(row => mergeTranslation(row, trMap.get(row.id) ?? null));
}

export async function getTourBySlug(slug: string, locale: string = 'de'): Promise<Tour | undefined> {
  const { data: row } = await db.from('tours').select('*').eq('slug', slug).single();
  if (!row) return undefined;

  const tr = await getSingleTranslation('tours', row.id, locale);
  return mergeTranslation(row, tr);
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
  const { data: rows } = await db.from('tours').select('*').eq('category', category).order('created_at', { ascending: false });
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('tours', rows.map(r => r.id), locale);
  return rows.map(row => mergeTranslation(row, trMap.get(row.id) ?? null));
}

export async function getToursByDestination(destinationSlug: string, locale: string = 'de'): Promise<Tour[]> {
  const { data: rows } = await db.from('tours').select('*').eq('destination_slug', destinationSlug).order('created_at', { ascending: false });
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('tours', rows.map(r => r.id), locale);
  return rows.map(row => mergeTranslation(row, trMap.get(row.id) ?? null));
}

export async function getFeaturedTours(locale: string = 'de'): Promise<Tour[]> {
  const { data: rows } = await db.from('tours').select('*').eq('featured', true).order('created_at', { ascending: false });
  if (!rows || rows.length === 0) return [];

  const trMap = await getTranslationsMap('tours', rows.map(r => r.id), locale);
  return rows.map(row => mergeTranslation(row, trMap.get(row.id) ?? null));
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
    snorkel: { de: 'Schnorchel', en: 'Snorkelling', fr: 'Snorkeling', ru: 'Снорклинг', ar: 'سنوركلينغ', hu: 'Sznorkelezés' },
    kultur: { de: 'Kultur', en: 'Culture', fr: 'Culture', ru: 'Культура', ar: 'ثقافة', hu: 'Kultúra' },
  };
  return fallback[slug]?.[locale] ?? slug;
}

export async function getLocalizedTour(slug: string, locale: string): Promise<Tour | undefined> {
  return getTourBySlug(slug, locale);
}

export async function getLocalizedAllTours(locale: string): Promise<Tour[]> {
  return getTours(locale);
}
