<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HARD RULE — Write Approval (no exceptions)

**No script may be run with `--execute`, `--apply`, or any other direct-write flag under any circumstances unless Yassin has posted explicit written approval in this chat for that specific batch of changes.**

- Before ANY write is proposed: show Yassin the actual draft text (the full content that will be written, not a summary or a count).
- Wait for an explicit, written "approved / go ahead / apply" message from Yassin covering that specific batch.
- A completed dry-run report is NOT approval. Being told a step is "recommended" is NOT approval. Approval from the question tool dialog is NOT approval unless Yassin also posts written confirmation of the exact batch.
- When in doubt, do not write. Run dry-run / read-only modes only, or ask.

This rule covers all scripts that mutate the Supabase database or any other live data. Violations are treated as serious process failures.

**Broken/failed approved scripts at execute-time:** If a previously-approved script fails, is non-functional, or needs modification when it is actually run, the agent must STOP. Do not silently write a replacement write-loop (or any other substitute implementation) and run it, even if the agent is confident it does the same thing. Instead: show Yassin the corrected code / the diff of what needs to change, and wait for fresh explicit written approval before running it. This counts as a NEW batch requiring its own approval — it is NOT a continuation of the old approval. A failed run or a non-functional script never authorizes a substitute write path by itself.

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

# Session — Aug 09 2026: Full Itinerary Rewrites (FR/HU/RU)

Word-level replacements couldn't fully clean itineraries, so flagged tours got **full professional rewrites** of every itinerary step.

## Scripts
- `scripts/itin_full_locale.cjs` — READ-ONLY dump of DE + locale itinerary for flagged tours → `{locale}_itin_full.json`
- `scripts/itin_audit_locale.cjs <fr|hu|ru>` — READ-ONLY itinerary audit; has **per-locale native-word exclusions** (`fr`: `des`,`Tour`; `hu`: `mit`; `ru`: none)
- `scripts/fix-fr-itineraries.cjs` — 22 FR full rewrites (flag `--apply`)
- `scripts/fix-hu-itineraries.cjs` — 23 HU full rewrites (flag `--apply`)
- `scripts/fix-ru-itineraries.cjs` — 21 RU full rewrites (flag `--execute`)

## Data model notes
- `content_translations.itinerary` is NULL — itineraries live in `content` (JSON array of `{title, content}` steps). Audits read `itinerary ?? content`.

## Result
| Locale | Rewrites | Audit after |
|--------|----------|-------------|
| FR | 22 | 0 flagged (29 clean) |
| HU | 23 | 0 flagged (29 clean) |
| RU | 21 | 0 flagged (29 clean) |

**Total: 66 itinerary rewrites applied; 0 German words remain.** `des`/`Tour` (native FR) and `mit` (native HU) are known false positives, excluded per-locale in the audit.
