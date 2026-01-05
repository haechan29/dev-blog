'use client';

import clsx from 'clsx';
import { AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const SCREEN_RATIO = 16 / 9;
const OVERSIZE_THRESHOLD = 3;

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSize, setExpandedSize] = useState({ width: 0, height: 0 });
  const [isError, setIsError] = useState(false);
  const [isOversized, setIsOversized] = useState(false);
  const naturalSizeRef = useRef<{ width: number; height: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsError(false);
    setIsExpanded(false);
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
      <div
        data-image-with-caption
        data-caption={caption}
        data-start-offset={startOffset}
        data-end-offset={endOffset}
        className='w-full h-full relative'
      >
        <div
          data-image-container
          className={clsx('w-full h-full', isExpanded && 'overflow-auto')}
        >
          <Image
            src={src}
            alt={alt}
            width={1000}
            height={1000}
            onError={() => setIsError(true)}
            onLoad={e => {
              setIsError(false);
              naturalSizeRef.current = {
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              };
            }}
            className={clsx(
              'max-w-none!',
              isExpanded ? 'min-w-full min-h-full' : 'object-contain'
            )}
            style={{
              width: isExpanded ? expandedSize.width : '100%',
              height: isExpanded ? expandedSize.height : '100%',
            }}
          />
        </div>

        <button
          type='button'
          aria-label={isExpanded ? '이미지 축소' : '이미지 확대'}
          onClick={e => {
            e.stopPropagation();

            if (!isExpanded) {
              const container =
                e.currentTarget.parentElement?.querySelector('div');
              if (!container || !naturalSizeRef.current) return;

              const { width: naturalWidth, height: naturalHeight } =
                naturalSizeRef.current;

              const scale =
                Math.max(
                  container.offsetWidth / naturalWidth,
                  container.offsetHeight / naturalHeight
                ) * 0.9;
              setExpandedSize({
                width: naturalWidth * scale,
                height: naturalHeight * scale,
              });
            }
            setIsExpanded(isExpanded => !isExpanded);
          }}
          className='absolute top-2 right-3 p-2 bg-black/40 hover:bg-black/30 cursor-pointer rounded-lg text-white'
        >
          {isExpanded ? (
            <Minimize2 className='w-4 h-4 hover:animate-pop hover:[--scale:0.8]' />
          ) : (
            <Maximize2 className='w-4 h-4 hover:animate-pop' />
          )}
        </button>
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
        {isOversized && (
          <div className='absolute top-6 right-2 bg-amber-500/50 backdrop-blur-xs text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-sm'>
            <AlertCircle className='w-4 h-4' />
            <span className=''>이미지가 길어서 전체화면에서 작게 보여요</span>
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
