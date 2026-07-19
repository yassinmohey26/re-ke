import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { saveTranslations, invalidateTranslationCache } from '@/lib/data/translations';

const db = getSupabaseAdmin();

// GET /api/admin/translations?locale=de&namespace=nav
// or GET /api/admin/translations?locale=de (all namespaces)
// or GET /api/admin/translations (all rows)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale');
  const namespace = searchParams.get('namespace');

  let query = db.from('ui_translations').select('*').order('namespace').order('key');

  if (locale) query = query.eq('locale', locale);
  if (namespace) query = query.eq('namespace', namespace);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ rows: data });
}

// PUT /api/admin/translations
// Body: { rows: [{ locale, namespace, key, value }] }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'rows array required' }, { status: 400 });
    }

    // Validate each row
    for (const row of rows) {
      if (!row.locale || !row.namespace || !row.key || row.value === undefined) {
        return NextResponse.json({ error: 'Each row needs locale, namespace, key, value' }, { status: 400 });
      }
    }

    await saveTranslations(rows);

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/translations
// Body: { locale, namespace, key } — deletes a single key
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { locale, namespace, key } = body;

    if (!locale || !namespace || !key) {
      return NextResponse.json({ error: 'locale, namespace, key required' }, { status: 400 });
    }

    const { error } = await db
      .from('ui_translations')
      .delete()
      .eq('locale', locale)
      .eq('namespace', namespace)
      .eq('key', key);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Bump version
    const { data: versionRow } = await db
      .from('ui_translations_version')
      .select('version')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (versionRow) {
      await db
        .from('ui_translations_version')
        .update({ version: versionRow.version + 1, updated_at: new Date().toISOString() })
        .eq('id', 1);
    }

    await invalidateTranslationCache();

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
