'use client';

import ExitFullscreenButton from '@/components/postViewer/exitFullscreenButton';
import PageIndicatorSection from '@/components/postViewer/pageIndicatorSection';
import TTSSection from '@/components/postViewer/ttsSection';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { canTouch } from '@/lib/browser';
import { setIsMouseOnControlBar } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function PostViewerControlBar({
  isPageTransitioning,
}: {
  isPageTransitioning: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { areBarsVisible, pageNumber, totalPages } = usePostViewer();

  const progress = useMemo(() => {
    if (!pageNumber || !totalPages || totalPages <= 2) return null;
    return ((pageNumber - 1) / (totalPages - 2)) * 100;
  }, [pageNumber, totalPages]);

  const handleMouseEnter = useCallback(() => {
    if (canTouch) return;
    dispatch(setIsMouseOnControlBar(true));
  }, [dispatch]);

  const handleMouseLeave = useCallback(() => {
    if (canTouch) return;
    dispatch(setIsMouseOnControlBar(false));
  }, [dispatch]);

  return (
    <>
      <div
        className={clsx(
          'absolute bottom-0 left-0 w-full h-1 bg-gray-200',
          'transition-opacity duration-300 ease-in-out',
          !isPageTransitioning && 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className='w-full h-1 bg-blue-500'
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        onClick={e => e.stopPropagation()}
        className={clsx(
          'absolute bottom-0 inset-x-0 z-50',
          'max-md:from-black/50 max-md:to-transparent max-md:bg-linear-to-t',
          'transition-opacity duration-300 ease-in-out',
          (isPageTransitioning || !areBarsVisible) &&
            'opacity-0 pointer-events-none'
        )}
      >
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className='flex flex-col gap-6 mb-4 mx-4 lg:mx-6'
        >
          {progress !== null && (
            <ProgressSection progress={progress} className='px-2' />
          )}

          <div className='flex w-full justify-between items-center'>
            <div className='flex items-center gap-4'>
              <TTSSection />
              <PageIndicatorSection />
            </div>
            <ExitFullscreenButton />
          </div>
        </div>
      </div>
    </>
  );
}

function ProgressSection({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  return (
    progress !== null && (
      <div className={cn('flex-1 min-w-0', className)}>
        <div className='relative w-full h-0.5 bg-gray-200'>
          <div
            className='relative h-0.5 bg-blue-500'
            style={{ width: `${progress}%` }}
          >
            <div className='absolute w-3 h-3 -top-1 -right-1.5 bg-blue-500 rounded-full' />
          </div>
        </div>
      </div>
    )
  );
}
