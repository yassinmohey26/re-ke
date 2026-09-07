import { revalidatePath } from 'next/cache';

export function revalidateReviewPages() {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/touren/[slug]', 'page');
}
