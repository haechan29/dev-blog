'use client';

import ImageCropOverlay from '@/components/write/imageCropOverlay';
import { buildImageUrl } from '@/features/media/domain/lib/url';
import useImageCrop from '@/features/media/hooks/useImageCrop';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { AlertCircle, Crop } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const SCREEN_RATIO = 16 / 9;
const OVERSIZE_THRESHOLD = 3;

export default function ImageWithCaption({
  node,
  updateAttributes,
  editor,
  selected,
}: NodeViewProps) {
  const { src, alt, size, status, id } = node.attrs;
  const [isError, setIsError] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isOversized, setIsOversized] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { cropImage } = useImageCrop(editor);

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
        setTimeout(() => {
          overlayRef.current?.style.setProperty('--reveal-angle', '0deg');
        }, 300);
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
        <div
          className={clsx(
            'flex items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700',
            selected && 'ring-2 ring-blue-300'
          )}
        >
          이미지를 불러올 수 없습니다
        </div>
      ) : (
        <div
          ref={containerRef}
          className={clsx('relative', imageSize)}
          onClick={() => setShowToolbar(true)}
        >
          <div
            className={clsx(
              'relative',
              selected && 'ring-2 ring-blue-300 rounded-lg'
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
                setIsOversized(ratio / SCREEN_RATIO > OVERSIZE_THRESHOLD);
              }}
              className='w-full h-auto'
            />

            {showToolbar && (
              <ImageToolbar
                size={size}
                updateAttributes={updateAttributes}
                onCropClick={() => setIsCropOpen(true)}
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

            {isOversized && !showToolbar && (
              <div className='absolute top-2 right-2 bg-amber-500/50 backdrop-blur-xs text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-sm'>
                <AlertCircle className='w-4 h-4' />
                <span>이미지가 길어서 작게 보여요</span>
              </div>
            )}
          </div>

          {(node.attrs.alt || showToolbar) && (
            <input
              type='text'
              value={node.attrs.alt || ''}
              onChange={e => updateAttributes({ alt: e.target.value })}
              placeholder='설명을 입력하세요'
              className='text-center text-sm text-gray-600 w-full focus:outline-none bg-transparent'
            />
          )}
        </div>
      )}

      <ImageCropOverlay
        imageUrl={src}
        isOpen={isCropOpen}
        setIsOpen={setIsCropOpen}
        onConfirm={async croppedFile => {
          await cropImage(croppedFile, id);
          setIsCropOpen(false);
        }}
      />
    </NodeViewWrapper>
  );
}

function ImageToolbar({
  size,
  updateAttributes,
  onCropClick,
}: {
  size: 'medium' | 'large';
  updateAttributes: (attrs: Record<string, unknown>) => void;
  onCropClick: () => void;
}) {
  return (
    <div className='absolute top-2 left-1/2 -translate-x-1/2 z-10'>
      <div className='flex items-center gap-1 bg-gray-800 rounded-lg shadow-lg p-1'>
        <button
          className={clsx(
            'px-2 py-1.5 text-sm rounded-md transition-colors',
            size === 'medium'
              ? 'text-white font-medium bg-gray-700'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          )}
          onClick={() => updateAttributes({ size: 'medium' })}
        >
          보통
        </button>
        <button
          className={clsx(
            'px-2 py-1.5 text-sm rounded-md transition-colors',
            size === 'large'
              ? 'text-white font-medium bg-gray-700'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          )}
          onClick={() => updateAttributes({ size: 'large' })}
        >
          크게
        </button>

        <div className='w-px h-5 bg-gray-600' />

        <button
          className='flex items-center gap-1 px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors'
          onClick={onCropClick}
        >
          <Crop className='w-4 h-4' />
          <span className='hidden sm:inline'>자르기</span>
        </button>
      </div>
    </div>
  );
}
