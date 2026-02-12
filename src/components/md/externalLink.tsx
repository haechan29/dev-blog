'use client';

/* eslint-disable @next/next/no-img-element */
import { OgDto } from '@/features/og/data/dto/ogDto';
import { getOg } from '@/features/og/data/repository/ogClientRepository';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

export default function ExternalLink({
  href,
  children,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
  'data-variant': variant,
}: {
  href: string;
  children: ReactNode;
  'data-start-offset': string;
  'data-end-offset': string;
  'data-variant'?: 'standalone' | 'inline';
}) {
  const isExternal = href.startsWith('http') || href.startsWith('//');
  const linkProps = {
    href,
    'data-start-offset': startOffset,
    'data-end-offset': endOffset,
    ...(isExternal && {
      rel: 'noopener noreferrer',
      target: '_blank' as const,
    }),
  };

  const [og, setOg] = useState<OgDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isValidUrl(href) && variant === 'standalone') {
      setIsLoading(true);
      getOg(href)
        .then(setOg)
        .catch(() => setOg(null))
        .finally(() => setIsLoading(false));
    }
  }, [href, variant]);

  if (variant === 'standalone') {
    if (isLoading) {
      return (
        <div className='flex flex-col w-full sm:w-[60%] 2xl:w-[40%] overflow-hidden rounded-lg border border-gray-200 my-4 animate-pulse'>
          <div className='w-full aspect-video sm:max-h-[250px] bg-gray-200' />
          <div className='flex flex-col gap-2 p-4'>
            <div className='h-4 bg-gray-200 rounded w-3/4' />
            <div className='h-3 bg-gray-200 rounded w-full' />
          </div>
        </div>
      );
    }

    if (og?.title && og.description && og.image) {
      return (
        <Link
          {...linkProps}
          className='flex flex-col w-full sm:w-[60%] 2xl:w-[40%] overflow-hidden rounded-lg border border-gray-200 hover:bg-gray-50 no-underline my-4'
        >
          <div className='w-full aspect-video'>
            <img
              src={og.image}
              alt={og.title}
              className='h-full w-full object-cover rounded-none'
            />
          </div>
          <div className='flex flex-col gap-1 p-4'>
            <span className='truncate text-sm font-semibold text-gray-900'>
              {og.title}
            </span>
            <span className='line-clamp-2 text-xs text-gray-500'>
              {og.description}
            </span>
          </div>
        </Link>
      );
    }
  }

  return <Link {...linkProps}>{children}</Link>;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
