import { revalidatePath } from 'next/cache';

const locales = ['de', 'en', 'fr', 'hu', 'ru', 'ar'];

export function revalidateTourPages() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/touren`);
  }
  revalidatePath('/[locale]/touren/[slug]', 'page');
}
