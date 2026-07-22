import { createHash } from 'crypto';

const DEEPL_KEY = process.env.DEEPL_API_KEY ?? '';
const DEEPL_FREE = DEEPL_KEY.endsWith(':fx');
const DEEPL_BASE = DEEPL_FREE
  ? 'https://api-free.deepl.com/v2'
  : 'https://api.deepl.com/v2';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const TRANSLATION_CACHE_VERSION = 'v2';
const cache = new Map<string, { data: string; expiresAt: number }>();

const BATCH_SEP = '\n§§\n';
const FIELD_SEP = '\n---SPLIT---\n';

function cacheKey(locale: string, sourceHash: string, field: string): string {
  return `${TRANSLATION_CACHE_VERSION}:${locale}:${sourceHash}:${field}`;
}

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, value: string): void {
  cache.set(key, { data: value, expiresAt: Date.now() + CACHE_TTL_MS });
}

function contentHash(text: string): string {
  return createHash('md5').update(text).digest('hex').slice(0, 12);
}

function sourceHash(obj: Record<string, unknown>): string {
  return contentHash(JSON.stringify(obj));
}

interface DeepLResponse {
  translations: { text: string }[];
}

const MIN_DELAY_MS = 250;
let lastCallAt = 0;

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function callDeepL(texts: string[], targetLang: string, tagHandling?: string): Promise<string[]> {
  if (!DEEPL_KEY || texts.length === 0) return texts;

  const elapsed = Date.now() - lastCallAt;
  if (elapsed < MIN_DELAY_MS) {
    await sleep(MIN_DELAY_MS - elapsed);
  }

  const body = new URLSearchParams();
  body.append('source_lang', 'DE');
  body.append('target_lang', targetLang.toUpperCase());
  if (tagHandling) body.append('tag_handling', tagHandling);
  for (const t of texts) {
    body.append('text', t);
  }

  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(Math.min(1000 * Math.pow(2, attempt), 8000));
    }

    lastCallAt = Date.now();
    try {
      const res = await fetch(`${DEEPL_BASE}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `DeepL-Auth-Key ${DEEPL_KEY}`,
        },
        body: body.toString(),
      });

      if (res.status === 429) {
        continue;
      }

      if (!res.ok) {
        if (res.status === 403 || res.status === 456) {
          console.warn(`[translate] DeepL auth error ${res.status} — check DEEPL_API_KEY`);
        }
        return texts;
      }

      const json: DeepLResponse = await res.json();
      return json.translations.map((t) => t.text);
    } catch {
      if (attempt === MAX_RETRIES) return texts;
    }
  }
  return texts;
}

async function batchTranslate(
  entries: { text: string; key: string; hash: string; field: string }[],
  targetLang: string,
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const uncached: { text: string; idx: number }[] = [];

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (!e.text || targetLang === 'de') {
      results.set(e.key, e.text);
      continue;
    }
    const ck = cacheKey(targetLang, e.hash, e.field);
    const cached = getCached(ck);
    if (cached !== null) {
      results.set(e.key, cached);
    } else {
      uncached.push({ text: e.text, idx: i });
    }
  }

  if (uncached.length === 0) return results;

  const combined = uncached.map((u) => entries[u.idx].text).join(BATCH_SEP);
  const [translated] = await callDeepL([combined], targetLang);
  const parts = (translated ?? combined).split(BATCH_SEP);

  for (let i = 0; i < uncached.length; i++) {
    const val = parts[i]?.trim() ?? uncached[i].text;
    const e = entries[uncached[i].idx];
    const ck = cacheKey(targetLang, e.hash, e.field);
    setCache(ck, val);
    results.set(e.key, val);
  }

  return results;
}

export interface TourTranslation {
  name: string;
  shortDescription: string;
  description: string;
  categoryLabel: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  meetingPoint: string;
  duration: string;
}

export async function translateTour(
  tour: {
    name: string;
    shortDescription: string;
    description: string;
    categoryLabel: string;
    highlights: string[];
    included: string[];
    notIncluded: string[];
    itinerary: { title: string; content: string }[];
    faqs: { question: string; answer: string }[];
    meetingPoint: string;
    duration: string;
  },
  locale: string,
): Promise<TourTranslation> {
  if (locale === 'de') {
    return {
      name: tour.name,
      shortDescription: tour.shortDescription,
      description: tour.description,
      categoryLabel: tour.categoryLabel,
      highlights: tour.highlights,
      included: tour.included,
      notIncluded: tour.notIncluded,
      itinerary: tour.itinerary,
      faqs: tour.faqs,
      meetingPoint: tour.meetingPoint,
      duration: tour.duration,
    };
  }

  const h = sourceHash(tour);
  const ck = (field: string) => cacheKey(locale, h, field);

  // Check if already fully cached
  if (
    getCached(ck('name')) !== null &&
    getCached(ck('description')) !== null
  ) {
    const getC = (field: string) => getCached(ck(field));
    const parseArr = (val: string | null | undefined, fallback: string[]) =>
      val ? val.split(FIELD_SEP).map((s) => s.trim()) : fallback;
    const itinTitles = parseArr(getC('itinTitles'), tour.itinerary.map((i) => i.title));
    const itinContents = parseArr(getC('itinContents'), tour.itinerary.map((i) => i.content));
    const faqQ = parseArr(getC('faqQ'), tour.faqs.map((f) => f.question));
    const faqA = parseArr(getC('faqA'), tour.faqs.map((f) => f.answer));
    return {
      name: getC('name') ?? tour.name,
      shortDescription: getC('shortDescription') ?? tour.shortDescription,
      description: getC('description') ?? tour.description,
      categoryLabel: getC('categoryLabel') ?? tour.categoryLabel,
      meetingPoint: getC('meetingPoint') ?? tour.meetingPoint,
      duration: getC('duration') ?? tour.duration,
      highlights: parseArr(getC('highlights'), tour.highlights),
      included: parseArr(getC('included'), tour.included),
      notIncluded: parseArr(getC('notIncluded'), tour.notIncluded),
      itinerary: tour.itinerary.map((item, i) => ({
        title: itinTitles[i] ?? item.title,
        content: itinContents[i] ?? item.content,
      })),
      faqs: tour.faqs.map((item, i) => ({
        question: faqQ[i] ?? item.question,
        answer: faqA[i] ?? item.answer,
      })),
    };
  }

  // Batch 1: scalar text fields
  const scalarFields = ['name', 'shortDescription', 'categoryLabel', 'meetingPoint', 'duration'] as const;
  const scalarEntries = scalarFields.map((field) => ({
    text: tour[field],
    key: field,
    hash: h,
    field,
  }));
  const scalars = await batchTranslate(scalarEntries, locale);

  // The overview is HTML authored in the CMS. Translate it separately so DeepL
  // preserves its markup rather than treating tags as plain text.
  const descriptionKey = ck('description');
  const cachedDescription = getCached(descriptionKey);
  let description: string;
  if (cachedDescription !== null) {
    description = cachedDescription;
  } else {
    const [translatedDescription] = await callDeepL([tour.description], locale, 'html');
    description = translatedDescription ?? tour.description;
    setCache(descriptionKey, description);
  }

  // Batch 2: array fields (join into single strings)
  const arrayEntries = [
    { text: tour.highlights.join(FIELD_SEP), key: 'highlights', hash: h, field: 'highlights' },
    { text: tour.included.join(FIELD_SEP), key: 'included', hash: h, field: 'included' },
    { text: tour.notIncluded.join(FIELD_SEP), key: 'notIncluded', hash: h, field: 'notIncluded' },
  ];
  const arrays = await batchTranslate(arrayEntries, locale);

  // Batch 3: complex fields (itinerary + FAQs)
  const itinTitles = tour.itinerary.map((i) => i.title).join(FIELD_SEP);
  const itinContents = tour.itinerary.map((i) => i.content).join(FIELD_SEP);
  const faqQ = tour.faqs.map((f) => f.question).join(FIELD_SEP);
  const faqA = tour.faqs.map((f) => f.answer).join(FIELD_SEP);

  const complexEntries = [
    { text: itinTitles, key: 'itinTitles', hash: h, field: 'itinTitles' },
    { text: itinContents, key: 'itinContents', hash: h, field: 'itinContents' },
    { text: faqQ, key: 'faqQ', hash: h, field: 'faqQ' },
    { text: faqA, key: 'faqA', hash: h, field: 'faqA' },
  ];
  const complex = await batchTranslate(complexEntries, locale);

  const parseArr = (val: string | undefined, fallback: string[]) =>
    val ? val.split(FIELD_SEP).map((s) => s.trim()) : fallback;

  const itinTitlesParsed = parseArr(complex.get('itinTitles'), tour.itinerary.map((i) => i.title));
  const itinContentsParsed = parseArr(complex.get('itinContents'), tour.itinerary.map((i) => i.content));
  const faqQParsed = parseArr(complex.get('faqQ'), tour.faqs.map((f) => f.question));
  const faqAParsed = parseArr(complex.get('faqA'), tour.faqs.map((f) => f.answer));

  const itinerary = tour.itinerary.map((item, i) => ({
    title: itinTitlesParsed[i] ?? item.title,
    content: itinContentsParsed[i] ?? item.content,
  }));

  const faqs = tour.faqs.map((item, i) => ({
    question: faqQParsed[i] ?? item.question,
    answer: faqAParsed[i] ?? item.answer,
  }));

  return {
    name: scalars.get('name') ?? tour.name,
    shortDescription: scalars.get('shortDescription') ?? tour.shortDescription,
    description,
    categoryLabel: scalars.get('categoryLabel') ?? tour.categoryLabel,
    meetingPoint: scalars.get('meetingPoint') ?? tour.meetingPoint,
    duration: scalars.get('duration') ?? tour.duration,
    highlights: parseArr(arrays.get('highlights'), tour.highlights),
    included: parseArr(arrays.get('included'), tour.included),
    notIncluded: parseArr(arrays.get('notIncluded'), tour.notIncluded),
    itinerary,
    faqs,
  };
}

export interface DestinationTranslation {
  name: string;
  tagline: string;
  description: string;
}

export async function translateDestination(
  dest: { name: string; tagline: string; description: string },
  locale: string,
): Promise<DestinationTranslation> {
  if (locale === 'de') return { name: dest.name, tagline: dest.tagline, description: dest.description };

  const h = sourceHash(dest);
  const results = await batchTranslate(
    [
      { text: dest.name, key: 'name', hash: h, field: 'name' },
      { text: dest.tagline, key: 'tagline', hash: h, field: 'tagline' },
      { text: dest.description, key: 'description', hash: h, field: 'description' },
    ],
    locale,
  );
  return {
    name: results.get('name') ?? dest.name,
    tagline: results.get('tagline') ?? dest.tagline,
    description: results.get('description') ?? dest.description,
  };
}

export interface CategoryTranslation {
  label: string;
  description: string;
}

export async function translateCategory(
  cat: { label: string; description: string },
  locale: string,
): Promise<CategoryTranslation> {
  if (locale === 'de') return { label: cat.label, description: cat.description };

  const h = sourceHash(cat);
  const results = await batchTranslate(
    [
      { text: cat.label, key: 'label', hash: h, field: 'label' },
      { text: cat.description, key: 'description', hash: h, field: 'description' },
    ],
    locale,
  );
  return {
    label: results.get('label') ?? cat.label,
    description: results.get('description') ?? cat.description,
  };
}

export interface BlogPostTranslation {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  tags: string[];
}

export async function translateBlogPost(
  post: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    tags: string[];
  },
  locale: string,
): Promise<BlogPostTranslation> {
  if (locale === 'de') {
    return {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      readTime: post.readTime,
      tags: post.tags,
    };
  }

  const h = sourceHash(post);

  // Check cache first
  const ck = (field: string) => cacheKey(locale, h, field);
  if (getCached(ck('title')) !== null && getCached(ck('content')) !== null) {
    const getC = (field: string) => getCached(ck(field));
    return {
      title: getC('title') ?? post.title,
      excerpt: getC('excerpt') ?? post.excerpt,
      content: getC('content') ?? post.content,
      category: getC('category') ?? post.category,
      readTime: getC('readTime') ?? post.readTime,
      tags: getC('tags') ? getC('tags')!.split(FIELD_SEP).map((s) => s.trim()) : post.tags,
    };
  }

  // Batch 1: non-HTML fields
  const nonHtml = await batchTranslate(
    [
      { text: post.title, key: 'title', hash: h, field: 'title' },
      { text: post.excerpt, key: 'excerpt', hash: h, field: 'excerpt' },
      { text: post.category, key: 'category', hash: h, field: 'category' },
      { text: post.readTime, key: 'readTime', hash: h, field: 'readTime' },
      { text: post.tags.join(FIELD_SEP), key: 'tags', hash: h, field: 'tags' },
    ],
    locale,
  );

  // Batch 2: HTML content (needs tag_handling)
  const contentKey = ck('content');
  const cachedContent = getCached(contentKey);
  let content: string;
  if (cachedContent !== null) {
    content = cachedContent;
  } else {
    const [translated] = await callDeepL([post.content], locale, 'html');
    content = translated ?? post.content;
    setCache(contentKey, content);
  }

  const tagsVal = nonHtml.get('tags');
  return {
    title: nonHtml.get('title') ?? post.title,
    excerpt: nonHtml.get('excerpt') ?? post.excerpt,
    content,
    category: nonHtml.get('category') ?? post.category,
    readTime: nonHtml.get('readTime') ?? post.readTime,
    tags: tagsVal ? tagsVal.split(FIELD_SEP).map((s) => s.trim()) : post.tags,
  };
}

export function contentHashValue(locale: string, obj: Record<string, unknown>): string {
  return `${locale}:${sourceHash(obj)}`;
}

// ── Bulk translate all tours in minimal API calls ────────────────
export interface BulkTourResult {
  name: string;
  shortDescription: string;
  description: string;
  categoryLabel: string;
  meetingPoint: string;
  duration: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { title: string; content: string }[];
  faqs: { question: string; answer: string }[];
}

export async function translateAllTours(
  tours: {
    name: string;
    shortDescription: string;
    description: string;
    categoryLabel: string;
    highlights: string[];
    included: string[];
    notIncluded: string[];
    itinerary: { title: string; content: string }[];
    faqs: { question: string; answer: string }[];
    meetingPoint: string;
    duration: string;
  }[],
  locale: string,
): Promise<BulkTourResult[]> {
  if (locale === 'de') {
    return tours.map((t) => ({
      name: t.name,
      shortDescription: t.shortDescription,
      description: t.description,
      categoryLabel: t.categoryLabel,
      meetingPoint: t.meetingPoint,
      duration: t.duration,
      highlights: t.highlights,
      included: t.included,
      notIncluded: t.notIncluded,
      itinerary: t.itinerary,
      faqs: t.faqs,
    }));
  }

  const results: BulkTourResult[] = tours.map((t) => ({
    name: t.name,
    shortDescription: t.shortDescription,
    description: t.description,
    categoryLabel: t.categoryLabel,
    meetingPoint: t.meetingPoint,
    duration: t.duration,
    highlights: t.highlights,
    included: t.included,
    notIncluded: t.notIncluded,
    itinerary: t.itinerary,
    faqs: t.faqs,
  }));

  // Check cache for each tour, collect uncached ones
  const scalarsToTranslate: { text: string; tourIdx: number; field: string }[] = [];
  const arraysToTranslate: { text: string; tourIdx: number; field: string }[] = [];
  const complexToTranslate: { text: string; tourIdx: number; field: string }[] = [];

  for (let i = 0; i < tours.length; i++) {
    const t = tours[i];
    const h = sourceHash(t);

    // Scalar fields
    for (const field of ['name', 'shortDescription', 'description', 'categoryLabel', 'meetingPoint', 'duration'] as const) {
      if (!t[field]) continue;
      const ck = cacheKey(locale, h, field);
      const cached = getCached(ck);
      if (cached !== null) {
        (results[i] as any)[field] = cached;
      } else {
        scalarsToTranslate.push({ text: t[field], tourIdx: i, field });
      }
    }

    // Array fields
    for (const field of ['highlights', 'included', 'notIncluded'] as const) {
      const joined = t[field].join(FIELD_SEP);
      if (!joined) continue;
      const ck = cacheKey(locale, h, field);
      const cached = getCached(ck);
      if (cached !== null) {
        (results[i] as any)[field] = cached.split(FIELD_SEP).map((s: string) => s.trim());
      } else {
        arraysToTranslate.push({ text: joined, tourIdx: i, field });
      }
    }

    // Complex fields
    const itinTitles = t.itinerary.map((x) => x.title).join(FIELD_SEP);
    const itinContents = t.itinerary.map((x) => x.content).join(FIELD_SEP);
    const faqQ = t.faqs.map((x) => x.question).join(FIELD_SEP);
    const faqA = t.faqs.map((x) => x.answer).join(FIELD_SEP);

    for (const [subField, text] of [['itinTitles', itinTitles], ['itinContents', itinContents], ['faqQ', faqQ], ['faqA', faqA]] as const) {
      if (!text) continue;
      const ck = cacheKey(locale, h, subField);
      const cached = getCached(ck);
      if (cached === null) {
        complexToTranslate.push({ text, tourIdx: i, field: subField });
      }
    }
  }

  // Batch 1: all scalar fields in one API call
  if (scalarsToTranslate.length > 0) {
    const combined = scalarsToTranslate.map((e) => e.text).join(BATCH_SEP);
    const [translated] = await callDeepL([combined], locale);
    const parts = (translated ?? combined).split(BATCH_SEP);
    for (let j = 0; j < scalarsToTranslate.length; j++) {
      const val = parts[j]?.trim() ?? scalarsToTranslate[j].text;
      const e = scalarsToTranslate[j];
      (results[e.tourIdx] as any)[e.field] = val;
      const t = tours[e.tourIdx];
      const h = sourceHash(t);
      setCache(cacheKey(locale, h, e.field), val);
    }
  }

  // Batch 2: all array fields in one API call
  if (arraysToTranslate.length > 0) {
    const combined = arraysToTranslate.map((e) => e.text).join(BATCH_SEP);
    const [translated] = await callDeepL([combined], locale);
    const parts = (translated ?? combined).split(BATCH_SEP);
    for (let j = 0; j < arraysToTranslate.length; j++) {
      const val = parts[j]?.trim() ?? arraysToTranslate[j].text;
      const e = arraysToTranslate[j];
      (results[e.tourIdx] as any)[e.field] = val.split(FIELD_SEP).map((s) => s.trim());
      const t = tours[e.tourIdx];
      const h = sourceHash(t);
      setCache(cacheKey(locale, h, e.field), val);
    }
  }

  // Batch 3: all complex fields in one API call
  if (complexToTranslate.length > 0) {
    const combined = complexToTranslate.map((e) => e.text).join(BATCH_SEP);
    const [translated] = await callDeepL([combined], locale);
    const parts = (translated ?? combined).split(BATCH_SEP);
    for (let j = 0; j < complexToTranslate.length; j++) {
      const val = parts[j]?.trim() ?? complexToTranslate[j].text;
      const e = complexToTranslate[j];
      const t = tours[e.tourIdx];
      const h = sourceHash(t);
      setCache(cacheKey(locale, h, e.field), val);
    }
  }

  // Reconstruct complex fields from cache
  for (let i = 0; i < tours.length; i++) {
    const t = tours[i];
    const h = sourceHash(t);

    const itinTitlesRaw = getCached(cacheKey(locale, h, 'itinTitles'));
    const itinContentsRaw = getCached(cacheKey(locale, h, 'itinContents'));
    const faqQRaw = getCached(cacheKey(locale, h, 'faqQ'));
    const faqARaw = getCached(cacheKey(locale, h, 'faqA'));

    if (itinTitlesRaw && itinContentsRaw) {
      const titles = itinTitlesRaw.split(FIELD_SEP).map((s) => s.trim());
      const contents = itinContentsRaw.split(FIELD_SEP).map((s) => s.trim());
      results[i].itinerary = t.itinerary.map((item, idx) => ({
        title: titles[idx] ?? item.title,
        content: contents[idx] ?? item.content,
      }));
    }

    if (faqQRaw && faqARaw) {
      const qs = faqQRaw.split(FIELD_SEP).map((s) => s.trim());
      const as = faqARaw.split(FIELD_SEP).map((s) => s.trim());
      results[i].faqs = t.faqs.map((item, idx) => ({
        question: qs[idx] ?? item.question,
        answer: as[idx] ?? item.answer,
      }));
    }
  }

  return results;
}

// ── Bulk translate all blog posts in minimal API calls ───────────
export interface BulkBlogResult {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  tags: string[];
}

export async function translateAllBlogPosts(
  posts: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    tags: string[];
  }[],
  locale: string,
): Promise<BulkBlogResult[]> {
  if (locale === 'de') {
    return posts.map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      readTime: p.readTime,
      tags: p.tags,
    }));
  }

  const results: BulkBlogResult[] = posts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    readTime: p.readTime,
    tags: p.tags,
  }));

  const scalarsToTranslate: { text: string; postIdx: number; field: string }[] = [];
  const contentsToTranslate: { text: string; postIdx: number }[] = [];

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const h = sourceHash(p);

    for (const field of ['title', 'excerpt', 'category', 'readTime'] as const) {
      if (!p[field]) continue;
      const ck = cacheKey(locale, h, field);
      const cached = getCached(ck);
      if (cached !== null) {
        (results[i] as any)[field] = cached;
      } else {
        scalarsToTranslate.push({ text: p[field], postIdx: i, field });
      }
    }

    if (p.tags.length > 0) {
      const joined = p.tags.join(FIELD_SEP);
      const ck = cacheKey(locale, h, 'tags');
      const cached = getCached(ck);
      if (cached !== null) {
        results[i].tags = cached.split(FIELD_SEP).map((s) => s.trim());
      } else {
        scalarsToTranslate.push({ text: joined, postIdx: i, field: 'tags' });
      }
    }

    if (p.content) {
      const ck = cacheKey(locale, h, 'content');
      const cached = getCached(ck);
      if (cached !== null) {
        results[i].content = cached;
      } else {
        contentsToTranslate.push({ text: p.content, postIdx: i });
      }
    }
  }

  if (scalarsToTranslate.length > 0) {
    const combined = scalarsToTranslate.map((e) => e.text).join(BATCH_SEP);
    const [translated] = await callDeepL([combined], locale);
    const parts = (translated ?? combined).split(BATCH_SEP);
    for (let j = 0; j < scalarsToTranslate.length; j++) {
      const val = parts[j]?.trim() ?? scalarsToTranslate[j].text;
      const e = scalarsToTranslate[j];
      (results[e.postIdx] as any)[e.field] = e.field === 'tags'
        ? val.split(FIELD_SEP).map((s) => s.trim())
        : val;
      const p = posts[e.postIdx];
      const h = sourceHash(p);
      setCache(cacheKey(locale, h, e.field), val);
    }
  }

  if (contentsToTranslate.length > 0) {
    const combined = contentsToTranslate.map((e) => e.text).join(BATCH_SEP);
    const [translated] = await callDeepL([combined], locale);
    const parts = (translated ?? combined).split(BATCH_SEP);
    for (let j = 0; j < contentsToTranslate.length; j++) {
      const val = parts[j]?.trim() ?? contentsToTranslate[j].text;
      const e = contentsToTranslate[j];
      results[e.postIdx].content = val;
      const p = posts[e.postIdx];
      const h = sourceHash(p);
      setCache(cacheKey(locale, h, 'content'), val);
    }
  }

  return results;
}
