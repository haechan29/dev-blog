'use client';

import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function ImageWithCaption({
  src,
  'data-size': size,
  'data-caption': caption,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
  'data-mode': mode,
  'data-status': status = 'success',
  alt = '',
}: {
  src: string;
  'data-size': 'medium' | 'large';
  'data-caption': string;
  'data-viewer-caption': string;
  'data-start-offset': string;
  'data-end-offset': string;
  'data-mode': 'preview' | 'reader' | 'viewer';
  'data-status': 'loading' | 'failed' | 'success';
  alt?: string;
}) {
  const [isError, setIsError] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setIsError(false), [src]);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (status === 'success') {
      overlayRef.current.style.setProperty('--reveal-angle', '360deg');
      setTimeout(() => {
        overlayRef.current?.style.setProperty('opacity', '0');
      }, 200);
    }

    if (status !== 'loading') return;
    let progress = 0.08;
    const interval = setInterval(() => {
      let amount: number;
      if (progress < 0.2) amount = 0.1;
      else if (progress < 0.5) amount = 0.04;
      else if (progress < 0.8) amount = 0.02;
      else if (progress < 0.99) amount = 0.005;
      else amount = 0;

      progress = Math.min(progress + amount, 0.994);
      const angle = progress * 360;
      overlayRef.current?.style.setProperty('--reveal-angle', `${angle}deg`);
    }, 400);

    return () => clearInterval(interval);
  }, [status]);

  if (!src || isError) {
    return (
      <div
        className='flex items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700 m-4'
        aria-label='이미지를 불러올 수 없습니다'
      >
        {'이미지를 불러올 수 없습니다'}
      </div>
    );
  }

  if (mode === 'viewer') {
    return (
      <Image
        data-image-with-caption
        data-caption={caption}
        data-start-offset={startOffset}
        data-end-offset={endOffset}
        src={src}
        alt={alt}
        width={1000}
        height={1000}
        objectFit='contain'
        onError={() => setIsError(true)}
        onLoad={() => setIsError(false)}
        className='h-full'
      />
    );
  }

  if (mode === 'reader') {
    return (
      <div
        data-image-with-caption
        data-start-offset={startOffset}
        data-end-offset={endOffset}
        data-size={size}
        className='flex flex-col gap-4'
      >
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1000}
          onError={() => setIsError(true)}
          onLoad={() => setIsError(false)}
          className={clsx(
            'h-auto',
            size === 'large' ? 'w-full' : 'min-w-56 w-1/2'
          )}
        />

        <div className='whitespace-pre-wrap'>
          {caption
            .split(/(?<!\\)#/)
            .map(s => s.replace(/\\#/g, '#'))
            .filter(Boolean)
            .join('')}
        </div>
      </div>
    );
  }

  return (
    <div
      data-image-with-caption
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      data-size={size}
      className='flex flex-col gap-4'
    >
      <div
        className={clsx(
          'relative',
          size === 'large' ? 'w-full' : 'min-w-56 w-1/2'
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1000}
          onError={() => setIsError(true)}
          onLoad={() => setIsError(false)}
          className='h-auto w-full'
        />
        {(status === 'loading' || status === 'success') && (
          <div
            ref={overlayRef}
            className='absolute inset-0 bg-black/30 rounded flex items-center justify-center'
            style={{
              maskImage:
                'conic-gradient(from 0deg, transparent var(--reveal-angle, 0deg), black var(--reveal-angle, 0deg))',
              transition: '--reveal-angle 200ms linear, opacity 300ms ease-out',
            }}
          >
            {status === 'loading' && (
              <div className='flex flex-col items-center gap-2 text-white drop-shadow-md'>
                <div className='w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                <span className='text-sm font-medium'>업로드 중...</span>
              </div>
            )}
          </div>
        )}
        {status === 'failed' && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded'>
            <div className='flex flex-col items-center gap-2 text-white drop-shadow-md'>
              <AlertCircle className='w-6 h-6' />
              <span className='text-sm font-medium'>업로드 실패</span>
            </div>
          </div>
        )}
      </div>

      <div className='whitespace-pre-wrap'>
        {caption
          .split(/(?<!\\)#/)
          .map(s => s.replace(/\\#/g, '#'))
          .filter(Boolean)
          .join('')}
      </div>
    </div>
  );
}
