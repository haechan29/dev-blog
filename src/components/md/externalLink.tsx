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

  const youtubeVideoId = getYouTubeVideoId(href);

  const youtubeOg =
    youtubeVideoId && variant === 'standalone'
      ? {
          title: getTextContent(children),
          description: 'YouTube',
          image: `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`,
          siteName: 'YouTube',
          favicon: 'https://www.youtube.com/favicon.ico',
          url: href,
        }
      : null;

  const resolvedOg = youtubeOg || og;

  useEffect(() => {
    if (variant !== 'standalone' || !isValidUrl(href) || youtubeVideoId) return;

    setIsLoading(true);
    getOg(href)
      .then(setOg)
      .catch(() => setOg(null))
      .finally(() => setIsLoading(false));
  }, [href, variant, youtubeVideoId]);

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

    if (resolvedOg?.title && resolvedOg.description && resolvedOg.image) {
      return (
        <Link
          {...linkProps}
          className='flex flex-col w-full sm:w-[60%] 2xl:w-[40%] overflow-hidden rounded-lg border border-gray-200 hover:bg-gray-50 no-underline my-4'
        >
          <div className='w-full aspect-video overflow-hidden'>
            <img
              src={resolvedOg.image}
              alt={resolvedOg.title}
              className='h-full w-full object-cover rounded-none'
            />
          </div>
          <div className='flex flex-col gap-1 p-4'>
            <span className='truncate text-sm font-semibold text-gray-900'>
              {resolvedOg.title}
            </span>
            <span className='line-clamp-2 text-xs text-gray-500'>
              {resolvedOg.description}
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

function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return getTextContent(node.props.children);
  }
  return '';
}
