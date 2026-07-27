'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { isRtl } from '@/i18n/config';

export default function HtmlDirection() {
  const locale = useLocale();

  useEffect(() => {
    const rtl = isRtl(locale);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
