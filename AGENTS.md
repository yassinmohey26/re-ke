<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Session — Jul 30 2026: Translation Cleanup (German→Locale)

## Scripts
- `scripts/translation-audit-huge.cjs` — multi-locale German word audit against Supabase
- `scripts/fix-ar.cjs` — AR word-level replacements (22 rows)
- `scripts/fix-ar-content.cjs` — AR title + sentence translation (21 rows)
- `scripts/fix-ar-exact.cjs` — AR exact body matches (23 rows)
- `scripts/fix-ar-last.cjs` — AR final stragglers (6 fields)
- `scripts/fix-word-replacements.cjs` — FR/HU/RU universal word replacements

## Result
| Locale | Before | After |
|--------|--------|-------|
| EN | 0 | 0 |
| AR | ~89 | 0 |
| FR | ~89 | 0 |
| HU | ~101 | 0 |
| RU | ~78 | 0 |

**Total: 0 German words across 26 tours × 6 locales.**

# Session — Jul 30 2026: Full Site Hardcoded Text Audit

## Files scanned
- 19 marketing pages under `app/[locale]/(marketing)/`
- 46 components under `components/`
- 7 layout/utility files
- 6 locale message files under `messages/*.json`

## Issues found (3 → 0)
| File | Issue | Fix |
|------|-------|-----|
| `components/tours/InteractivePricingTable.tsx:39-41` | Hardcoded `"Person"/"Personen"` | Added `t('person')` key |
| `app/[locale]/(marketing)/terms/page.tsx:78` | Hardcoded locale-checked `"Address"` | Replaced with `t('contact.addressLabel')` |
| `app/[locale]/(marketing)/kontakt/page.tsx:203-211` | 6 hardcoded German FAQs | Moved to `contact.faqQ1–faqA6` keys |

## New translation keys added (`messages/*.json`)
- `tours.person` — singular "Person" (6 locales)
- `terms.contact.addressLabel` — "Address" label (6 locales)
- `contact.faqSectionTitle`, `faqSectionDesc`, `faqQ1–6`, `faqA1–6` — contact page FAQs (6 locales)**
