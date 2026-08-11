import { revalidatePath } from 'next/cache';

// Localized pages that render destination data. Route structure:
//   app/[locale]/(marketing)/page.tsx                       -> /[locale]
//   app/[locale]/(marketing)/destinationen/page.tsx         -> /[locale]/destinationen
//   app/[locale]/(marketing)/destinationen/[slug]/page.tsx  -> /[locale]/destinationen/[slug]
// The (marketing) route group is stripped from URLs; the locale segment covers all
// 6 supported locales (de, en, ru, ar, fr, hu). Root "/" is middleware-redirected to
// /de, so /[locale] covers it too. The detail page is force-dynamic today; kept for
// completeness.
export function revalidateDestinationPages() {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/destinationen', 'page');
  revalidatePath('/[locale]/destinationen/[slug]', 'page');
}
