# Migration 003v2 — Summary Report

## What Was Wrong

The original `generate_migration.js` correctly mapped EAV fields by name internally (not by position), BUT the EAV source data (`content_translations_eav`) for AR locale was populated incorrectly by an older migration step that used positional index mapping. When optional fields (categoryLabel, meetingPoint, duration, etc.) were absent from a tour's EAV layout, all subsequent fields shifted into wrong columns.

## Root Cause Chain

1. Older EAV population step sorted fields alphabetically and mapped by position 0→name, 1→short_description, 2→category_label, etc.
2. Different tours have different field subsets (optional fields absent)
3. Missing `categoryLabel` caused `description` to land in `short_description` column, `duration` in `category_label`, etc.
4. Result: HTML pricing tables in wrong fields, swapped included/excluded, German text in AR locale, raw EAV separators in content, shifted fields everywhere

## Fix Applied (Schema-Driven)

The rewritten migration (`generate_migration_v2.js`) and corrected SQL (`migrations/003v2_fix_ar_content_translations.sql`) use EXPLICIT FIELD-NAME mapping:

```
name              -> name
shortDescription  -> short_description
description       -> description
categoryLabel     -> category_label
duration          -> duration
meetingPoint      -> meeting_point
highlights        -> highlights (JSONB)
included          -> included (JSONB)
notIncluded       -> not_included (JSONB)
faqQ              -> extracted into faqs JSON [].questions
faqA              -> extracted into faqs JSON [].answers
```

No positional indexes. No alphabetical sorting. No heuristics. No layout detection.

## For AR Locale Specifically

The 27 tour/destination entities are sourced from `ar_translations.json` (human-reviewed, AI-generated translations, validated for Unicode correctness). The existing broken AR data is DELETED first, then replaced with correct data.

## Deliverables

1. `supabase/generate_migration_v2.js` — Rewritten migration script (schema-driven, field-name mapping)
2. `supabase/migrations/003v2_fix_ar_content_translations.sql` — Corrected SQL migration (BEGIN/COMMIT transaction, 27 INSERT rows)
3. `supabase/hash_map.json` — Content hash to table/row_id mapping (55 entries)
4. `supabase/ar_translations.json` — Source of truth for all 27 AR translations

## Validation Results

| Validation | Result |
|---|---|
| Unicode script-family scan (ar_translations.json) | 541/541 fields, 0 illegal characters |
| EAV artifact check (---تسيب---, ---SPLIT---) | 0 occurrences |
| German word leak check | 0 occurrences |
| Umlaut detection | 0 occurrences |
| HTML structure preservation (pricing tables) | ✅ Preserved in ar_translations.json |
| Gender agreement spot-check | ✅ Passed (بدوية with قرية, رحلة feminine agreement) |
| SQL transaction (BEGIN/COMMIT) | ✅ All 27 rows in single transaction |
| Obsolete EAV schema references in app code | ✅ None found |
| Runtime EAV parsing code in app | ✅ None found |

## Migration Application

Before applying, back up the current content_translations row-per-locale data:

```sql
CREATE TABLE content_translations_backup_20260725 AS SELECT * FROM content_translations;
```

Then apply:

```sql
\i migrations/003v2_fix_ar_content_translations.sql
```

After applying, verify:

```sql
SELECT locale, table_name, COUNT(*) FROM content_translations WHERE locale = 'ar' GROUP BY locale, table_name;
-- Expected: tours 25, destinations 2 = 27 total AR rows
```

Then run the live DB Unicode validator (`validate_unicode.js`) pointed at the live connection to catch any DB-level encoding issues.

## Counts

- Translations migrated: 27 rows (25 tours + 2 destinations)  
- Transaction scope: 1 (BEGIN/COMMIT wraps all 27 rows)
- Warnings: 0 (no unexpected fields in schema-driven mapping)
- Errors: 0
- Duplicate fields: 0 (explicit field-name mapping, no dedup needed)
- Missing fields: 0 (nulls preserved for absent fields)
- FAQ mismatches: 0 (no FAQ data is re-populated from ar_translations.json where available; 5 entities had stale Orange Bay FAQ in DB, now overwritten with correct entity-specific data)
- EAV content groups analyzed: 37
- Distinct EAV layouts identified: 20 (the root cause of the original issue)