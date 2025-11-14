'use client';

import ProgressSection from '@/components/postViewer//progressSection';
import ExitFullscreenButton from '@/components/postViewer/exitFullscreenButton';
import PageIndicatorSection from '@/components/postViewer/pageIndicatorSection';
import TTSSection from '@/components/postViewer/ttsSection';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { canTouch } from '@/lib/browser';
import { setIsMouseOnControlBar } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function PostViewerControlBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { areBarsVisible } = usePostViewer();

  const handleMouseEnter = useCallback(() => {
    if (canTouch) return;
    dispatch(setIsMouseOnControlBar(true));
  }, [dispatch]);

  const handleMouseLeave = useCallback(() => {
    if (canTouch) return;
    dispatch(setIsMouseOnControlBar(false));
  }, [dispatch]);

  return (
    <div
      className={clsx(
        'absolute bottom-0 left-0 right-0 z-50',
        'max-md:from-black/50 max-md:to-transparent max-md:bg-gradient-to-t',
        'transition-opacity duration-300 ease-in-out',
        !areBarsVisible && 'opacity-0 pointer-events-none'
      )}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='flex flex-col px-2 md:px-4 lg:px-6'
      >
        <ProgressSection />

        <div className='flex w-full mb-3 justify-between items-center'>
          <div className='flex items-center'>
            <TTSSection />
            <PageIndicatorSection />
          </div>

          <ExitFullscreenButton />
        </div>
      </div>
    </div>
  );
}
