'use client';

import ProgressSection from '@/components/postViewer//progressSection';
import AutoAdvanceSection from '@/components/postViewer/autoAdvanceSection';
import ExitFullscreenButton from '@/components/postViewer/exitFullscreenButton';
import PageIndicatorSection from '@/components/postViewer/pageIndicatorSection';
import TTSSection from '@/components/postViewer/ttsSection';
import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { canTouch } from '@/lib/browser';
import { setIsMouseOnControlBar } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function PostViewerControlBar({ page }: { page: Page | null }) {
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        'absolute bottom-0 left-0 right-0 z-50 flex flex-col bg-white/80 backdrop-blur-md px-10',
        'transition-transform|opacity duration-300 ease-in-out',
        !areBarsVisible && 'translate-y-full opacity-0'
      )}
    >
      <ProgressSection />

      <div className='flex w-full mb-3 justify-between items-center'>
        <div className='flex items-center gap-2'>
          <PageIndicatorSection />
          <TTSSection page={page} />
          <AutoAdvanceSection />
        </div>

        <ExitFullscreenButton />
      </div>
    </div>
  );
}
