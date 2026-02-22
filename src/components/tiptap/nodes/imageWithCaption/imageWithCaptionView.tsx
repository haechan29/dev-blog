'use client';

import { buildImageUrl } from '@/features/media/domain/lib/url';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { AlertCircle, Crop, Type } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ImageWithCaptionView({
  node,
  updateAttributes,
}: NodeViewProps) {
  const { src, alt, size, status } = node.attrs;
  const [isError, setIsError] = useState(false);
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageSize = clsx(
    'h-auto',
    size === 'large' ? 'w-full' : 'w-[60%] min-w-[min(480px,100%)]'
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowToolbar(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (status === 'success') {
      overlayRef.current.style.setProperty('--reveal-angle', '360deg');
      setTimeout(() => {
        overlayRef.current?.style.setProperty('opacity', '0');
      }, 200);
      return;
    }

    if (status === 'loading') {
      overlayRef.current.style.setProperty('opacity', '1');

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
    }
  }, [status]);

  return (
    <NodeViewWrapper className='flex flex-col items-center gap-4 my-5 lg:my-6 xl:my-7'>
      {isError || !src ? (
        <div className='flex items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700'>
          이미지를 불러올 수 없습니다
        </div>
      ) : (
        <div
          ref={containerRef}
          className={clsx('relative', imageSize)}
          onClick={() => setShowToolbar(true)}
        >
          <div className='relative'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={buildImageUrl(src, '1200')}
              alt={alt}
              onError={() => setIsError(true)}
              onLoad={() => setIsError(false)}
              className='w-full h-auto'
            />

            {showToolbar && (
              <ImageToolbar
                size={size}
                updateAttributes={updateAttributes}
                onAddCaption={() => setShowCaptionInput(true)}
              />
            )}

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
          </div>
        </div>
      )}

      {(node.textContent || showCaptionInput) && (
        <NodeViewContent className='text-center text-sm text-gray-600 min-w-[100px] focus:outline-none' />
      )}
    </NodeViewWrapper>
  );
}

function ImageToolbar({
  size,
  updateAttributes,
  onAddCaption,
}: {
  size: 'medium' | 'large';
  updateAttributes: (attrs: Record<string, unknown>) => void;
  onAddCaption: () => void;
}) {
  return (
    <div className='absolute top-2 left-1/2 -translate-x-1/2 z-10'>
      <div className='flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-1'>
        <button
          className={clsx(
            'px-2 py-1.5 text-sm rounded-md transition-colors',
            size === 'medium'
              ? 'text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          )}
          onClick={() => updateAttributes({ size: 'medium' })}
        >
          보통
        </button>
        <button
          className={clsx(
            'px-2 py-1.5 text-sm rounded-md transition-colors',
            size === 'large'
              ? 'text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          )}
          onClick={() => updateAttributes({ size: 'large' })}
        >
          크게
        </button>

        <div className='w-px h-5 bg-gray-300' />

        <button
          className='flex items-center gap-1 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors'
          onClick={() => console.log('자르기 클릭')}
        >
          <Crop className='w-4 h-4' />
          <span className='hidden sm:inline'>자르기</span>
        </button>

        <div className='w-px h-5 bg-gray-300' />

        <button
          className='flex items-center gap-1 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors'
          onClick={onAddCaption}
        >
          <Type className='w-4 h-4' />
          <span className='hidden sm:inline'>설명</span>
        </button>
      </div>
    </div>
  );
}
