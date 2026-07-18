'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useCallback } from 'react';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof NextLink> & {
  locale?: string | false;
};

export default function Link({ locale: overrideLocale, href, ...rest }: LinkProps) {
  const defaultLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (overrideLocale !== undefined) {
        e.preventDefault();
        router.push(pathname, { locale: overrideLocale === false ? defaultLocale : overrideLocale });
      }
    },
    [overrideLocale, router, pathname, defaultLocale]
  );

  if (overrideLocale !== undefined) {
    return (
      <a
        href={typeof href === 'string' ? href : '#'}
        onClick={handleClick}
        {...rest}
      />
    );
  }

  return <NextLink href={href} {...rest} />;
}
