'use client';

import { OgDto } from '@/features/og/data/dto/ogDto';
import { getOg } from '@/features/og/data/repository/ogClientRepository';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LinkCard({ node }: NodeViewProps) {
  const { href, variant } = node.attrs;

  const [og, setOg] = useState<OgDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const domain = getDomain(href);

  useEffect(() => {
    if (!isValidUrl(href)) return;

    setIsLoading(true);
    getOg(href)
      .then(data => {
        const youtubeVideoId = getYouTubeVideoId(href);
        if (youtubeVideoId && !data.image) {
          data.image = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
        }
        setOg(data);
      })
      .catch(() => setOg(null))
      .finally(() => setIsLoading(false));
  }, [href]);

  if (isLoading) {
    if (variant === 'vertical') {
      return (
        <NodeViewWrapper className='not-prose flex flex-col w-full max-w-md overflow-hidden rounded-lg border border-gray-200 my-4 animate-pulse'>
          <div className='w-full aspect-video bg-gray-200' />
          <div className='flex flex-col gap-2 p-4'>
            <div className='h-4 bg-gray-200 rounded w-3/4' />
            <div className='h-3 bg-gray-200 rounded w-full' />
          </div>
        </NodeViewWrapper>
      );
    }
    return (
      <NodeViewWrapper className='not-prose flex w-full max-w-lg overflow-hidden rounded-lg border border-gray-200 my-4 animate-pulse'>
        <div className='w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 shrink-0' />
        <div className='flex flex-col gap-2 p-4 flex-1'>
          <div className='h-4 bg-gray-200 rounded w-3/4' />
          <div className='h-3 bg-gray-200 rounded w-full' />
          <div className='h-3 bg-gray-200 rounded w-1/2' />
        </div>
      </NodeViewWrapper>
    );
  }

  if (!og?.title || !og.image) {
    return (
      <NodeViewWrapper className='not-prose my-4'>
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:underline'
        >
          {href}
        </a>
      </NodeViewWrapper>
    );
  }

  if (variant === 'vertical') {
    return (
      <NodeViewWrapper className='not-prose flex flex-col w-full max-w-md overflow-hidden rounded-lg border border-gray-200 hover:bg-gray-50 my-4'>
        <a href={href} target='_blank' rel='noopener noreferrer'>
          <div className='w-full aspect-video overflow-hidden'>
            <Image
              width={1000}
              height={1000}
              src={og.image}
              alt={og.title}
              className='h-full w-full object-cover m-0! rounded-none!'
            />
          </div>
          <div className='flex flex-col gap-1 p-4'>
            <span className='truncate text-sm font-semibold text-gray-900'>
              {og.title}
            </span>
            {og.description && (
              <span className='line-clamp-2 text-xs text-gray-500'>
                {og.description}
              </span>
            )}
            <span className='text-xs text-gray-400'>
              {og.siteName || domain}
            </span>
          </div>
        </a>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className='not-prose flex w-full max-w-lg overflow-hidden rounded-lg border border-gray-200 hover:bg-gray-50 my-4'>
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className='flex w-full'
      >
        <div className='w-24 h-24 sm:w-32 sm:h-32 overflow-hidden shrink-0'>
          <Image
            width={200}
            height={200}
            src={og.image}
            alt={og.title}
            className='h-full w-full object-cover m-0! rounded-none!'
          />
        </div>
        <div className='flex flex-col justify-center gap-1 p-4 flex-1 min-w-0'>
          <span className='truncate text-sm font-semibold text-gray-900'>
            {og.title}
          </span>
          {og.description && (
            <span className='line-clamp-2 text-xs text-gray-500'>
              {og.description}
            </span>
          )}
          <span className='text-xs text-gray-400'>{og.siteName || domain}</span>
        </div>
      </a>
    </NodeViewWrapper>
  );
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
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
