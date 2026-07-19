import { getSupabaseAdmin } from '@/lib/supabase';

const db = getSupabaseAdmin();

interface TranslationRow {
  locale: string;
  namespace: string;
  key: string;
  value: string;
}

// In-memory cache: locale -> namespace -> key -> value
let cache: Record<string, Record<string, Record<string, string>>> = {};
let cacheVersion = 0;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 60 seconds

async function getVersion(): Promise<number> {
  const { data } = await db
    .from('ui_translations_version')
    .select('version')
    .order('id', { ascending: false })
    .limit(1)
    .single();
  return data?.version ?? 0;
}

async function fetchAllTranslations(): Promise<void> {
  const { data: rows } = await db
    .from('ui_translations')
    .select('locale, namespace, key, value');

  const result: Record<string, Record<string, Record<string, string>>> = {};

  for (const row of (rows || []) as TranslationRow[]) {
    if (!result[row.locale]) result[row.locale] = {};
    if (!result[row.locale][row.namespace]) result[row.locale][row.namespace] = {};
    result[row.locale][row.namespace][row.key] = row.value;
  }

  cache = result;
  cacheVersion = await getVersion();
  cacheTimestamp = Date.now();
}

export async function getTranslationsForLocale(locale: string): Promise<Record<string, Record<string, string>>> {
  const now = Date.now();
  const cacheExpired = now - cacheTimestamp > CACHE_TTL_MS;

  if (cacheExpired || !cache[locale]) {
    await fetchAllTranslations();
  }

  return cache[locale] || {};
}

export async function invalidateTranslationCache(): Promise<void> {
  cache = {};
  cacheVersion = 0;
  cacheTimestamp = 0;
}

export async function getTranslationVersion(): Promise<number> {
  return getVersion();
}

// Save a single translation and bump version
export async function saveTranslation(locale: string, namespace: string, key: string, value: string): Promise<void> {
  await db
    .from('ui_translations')
    .upsert({ locale, namespace, key, value, updated_at: new Date().toISOString() }, { onConflict: 'locale,namespace,key' });

  // Bump version
  const currentVersion = await getVersion();
  await db
    .from('ui_translations_version')
    .update({ version: currentVersion + 1, updated_at: new Date().toISOString() })
    .eq('id', 1);

  // Invalidate cache
  await invalidateTranslationCache();
}

// Save multiple translations at once
export async function saveTranslations(rows: { locale: string; namespace: string; key: string; value: string }[]): Promise<void> {
  const upserts = rows.map(r => ({ ...r, updated_at: new Date().toISOString() }));
  
  // Batch in groups of 100
  for (let i = 0; i < upserts.length; i += 100) {
    await db
      .from('ui_translations')
      .upsert(upserts.slice(i, i + 100), { onConflict: 'locale,namespace,key' });
  }

  // Bump version
  const currentVersion = await getVersion();
  await db
    .from('ui_translations_version')
    .update({ version: currentVersion + 1, updated_at: new Date().toISOString() })
    .eq('id', 1);

  await invalidateTranslationCache();
}
