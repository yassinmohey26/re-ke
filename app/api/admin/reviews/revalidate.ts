import { revalidatePath } from 'next/cache';
import { REVIEW_LOCALES } from '@/lib/reviews';

export function revalidateReviewPages() {
  for (const locale of REVIEW_LOCALES) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/airport-transfer`);
  }
  revalidatePath('/[locale]/(marketing)/touren/[slug]', 'page');
}
