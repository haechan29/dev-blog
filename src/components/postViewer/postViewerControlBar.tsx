'use client';

import ExitFullscreenButton from '@/components/postViewer/exitFullscreenButton';
import PageIndicatorSection from '@/components/postViewer/pageIndicatorSection';
import TTSSection from '@/components/postViewer/ttsSection';
import { RootState } from '@/lib/redux/store';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function PostViewerControlBar({
  isPageTransitioning,
  areBarsVisible,
  onMouseEnter,
  onMouseLeave,
  onInteraction,
}: {
  isPageTransitioning: boolean;
  areBarsVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onInteraction: () => void;
}) {
  const pages = useSelector((state: RootState) => state.postViewer.pages);
  const currentPageIndex = useSelector(
    (state: RootState) => state.postViewer.currentPageIndex
  );
  const pageNumber = useMemo(
    () => (currentPageIndex === null ? null : currentPageIndex + 1),
    [currentPageIndex]
  );
  const totalPages = useMemo(() => pages.length + 1, [pages.length]);

  const progress = useMemo(() => {
    if (!pageNumber || totalPages <= 2) return null;
    return ((pageNumber - 1) / (totalPages - 2)) * 100;
  }, [pageNumber, totalPages]);

  return (
    <>
      <div
        className={clsx(
          'absolute bottom-0 left-0 w-full h-1 bg-gray-200',
          'transition-opacity duration-300 ease-in-out',
          (areBarsVisible || !isPageTransitioning) &&
            'opacity-0 pointer-events-none'
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
          !areBarsVisible && 'opacity-0 pointer-events-none'
        )}
      >
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className='flex flex-col gap-6 mb-4 mx-4 lg:mx-6'
        >
          {progress !== null && (
            <ProgressSection progress={progress} className='px-2' />
          )}

          <div className='flex w-full justify-between items-center'>
            <div className='flex items-center gap-4'>
              <TTSSection onInteraction={onInteraction} />
              <PageIndicatorSection
                pageNumber={pageNumber}
                totalPages={totalPages}
              />
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
