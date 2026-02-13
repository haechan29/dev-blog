'use client';

import { buildImageUrl } from '@/features/media/domain/lib/url';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

const SCREEN_RATIO = 16 / 9;
const OVERSIZE_THRESHOLD = 3;

export default function ImageWithCaption({
  src,
  alt = '',
  'data-size': size,
  'data-mode': mode,
  'data-status': status,
  'data-caption': caption,
  'data-start-offset': startOffset,
  'data-end-offset': endOffset,
  children,
}: {
  src: string;
  alt?: string;
  'data-size': 'medium' | 'large';
  'data-mode': 'preview' | 'reader' | 'viewer';
  'data-status': 'loading' | 'failed' | 'success';
  'data-caption': string;
  'data-start-offset': string;
  'data-end-offset': string;
  children: ReactNode;
}) {
  const [isError, setIsError] = useState(false);
  const [isOversized, setIsOversized] = useState(false);

  const showErrorImage = useMemo(() => {
    return isError || !src || (mode !== 'preview' && src.startsWith('blob:'));
  }, [isError, mode, src]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsError(false);
  }, [src]);

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

  if (mode === 'viewer') {
    return (
      <div
        data-image-with-caption
        data-caption={caption}
        data-start-offset={startOffset}
        data-end-offset={endOffset}
        className='w-full h-full relative'
      >
        {showErrorImage ? (
          <ErrorImage />
        ) : (
          <Image
            src={buildImageUrl(src, 'original')}
            alt={alt}
            width={1000}
            height={1000}
            onError={() => setIsError(true)}
            onLoad={() => {
              setIsError(false);
            }}
            className='w-full h-full max-w-none! object-contain'
          />
        )}
      </div>
    );
  }

  if (mode === 'reader') {
    return (
      <div
        data-image-with-caption
        data-start-offset={startOffset}
        data-end-offset={endOffset}
        data-size={size}
        className='flex flex-col gap-4 items-center'
      >
        {showErrorImage ? (
          <ErrorImage />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={buildImageUrl(src, '1200')}
            srcSet={`${buildImageUrl(src, '800')} 800w, ${buildImageUrl(src, '1200')} 1200w, ${buildImageUrl(src, 'original')} 1920w`}
            sizes={
              size === 'large' ? '100vw' : '(min-width: 1024px) 50vw, 100vw'
            }
            alt={alt}
            width={1000}
            height={1000}
            decoding='async'
            loading='lazy'
            onError={() => setIsError(true)}
            onLoad={() => setIsError(false)}
            className={clsx(
              'h-auto',
              size === 'large'
                ? 'w-full max-w-4xl'
                : 'w-full lg:w-1/2 lg:min-w-120 max-w-2xl'
            )}
          />
        )}

        <div>{children}</div>
      </div>
    );
  }

  return (
    <div
      data-image-with-caption
      data-start-offset={startOffset}
      data-end-offset={endOffset}
      data-size={size}
      className='flex flex-col gap-4 items-center'
    >
      {showErrorImage ? (
        <ErrorImage />
      ) : (
        <div
          className={clsx(
            'relative',
            size === 'large' ? 'w-full' : 'min-w-56 w-1/2'
          )}
        >
          <Image
            src={buildImageUrl(src, '1200')}
            alt={alt}
            width={1000}
            height={1000}
            onError={() => setIsError(true)}
            onLoad={e => {
              setIsError(false);
              const { naturalWidth, naturalHeight } = e.currentTarget;
              const ratio = naturalWidth / naturalHeight;
              setIsOversized(
                ratio / SCREEN_RATIO > OVERSIZE_THRESHOLD ||
                  ratio / SCREEN_RATIO < 1 / OVERSIZE_THRESHOLD
              );
            }}
            className='h-auto w-full'
          />
          {(status === 'loading' || status === 'success') && (
            <div
              ref={overlayRef}
              className='absolute inset-0 bg-black/30 rounded flex items-center justify-center'
              style={{
                maskImage:
                  'conic-gradient(from 0deg, transparent var(--reveal-angle, 0deg), black var(--reveal-angle, 0deg))',
                transition:
                  '--reveal-angle 200ms linear, opacity 300ms ease-out',
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
          {isOversized && (
            <div className='absolute top-2 right-2 bg-amber-500/50 backdrop-blur-xs text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-sm'>
              <AlertCircle className='w-4 h-4' />
              <span>이미지가 길어서 전체화면에서 작게 보여요</span>
            </div>
          )}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}

function ErrorImage() {
  return (
    <div className='flex items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700'>
      이미지를 불러올 수 없습니다
    </div>
  );
}
