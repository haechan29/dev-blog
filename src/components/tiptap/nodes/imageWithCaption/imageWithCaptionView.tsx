'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buildImageUrl } from '@/features/media/domain/lib/url';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

export default function ImageWithCaptionView({
  node,
  updateAttributes,
}: NodeViewProps) {
  const { src, alt, size, status } = node.attrs;
  const [isError, setIsError] = useState(false);
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const imageSize = clsx(
    'h-auto',
    size === 'large' ? 'w-full' : 'w-[60%] min-w-[min(480px,100%)]'
  );

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
    <NodeViewWrapper className='not-prose flex flex-col items-center gap-4 my-5 lg:my-6 xl:my-7'>
      {isError || !src ? (
        <div className='flex items-center justify-center p-4 rounded-xl bg-gray-200 text-gray-700'>
          이미지를 불러올 수 없습니다
        </div>
      ) : (
        <div className={clsx('relative', imageSize)}>
          <ImageSettingsDropdown
            size={size}
            updateAttributes={updateAttributes}
            onAddCaption={() => setShowCaptionInput(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={buildImageUrl(src, '1200')}
              alt={alt}
              onError={() => setIsError(true)}
              onLoad={() => setIsError(false)}
              className='w-full h-auto cursor-pointer'
            />
          </ImageSettingsDropdown>

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
      )}

      {(node.textContent || showCaptionInput) && (
        <NodeViewContent className='text-center text-sm text-gray-600 min-w-[100px] focus:outline-none' />
      )}
    </NodeViewWrapper>
  );
}

function ImageSettingsDropdown({
  size,
  updateAttributes,
  onAddCaption,
  children,
}: {
  size: 'medium' | 'large';
  updateAttributes: (attrs: Record<string, unknown>) => void;
  onAddCaption: () => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => updateAttributes({ size: 'medium' })}>
          Medium {size === 'medium' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateAttributes({ size: 'large' })}>
          Large {size === 'large' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddCaption}>캡션 추가</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
