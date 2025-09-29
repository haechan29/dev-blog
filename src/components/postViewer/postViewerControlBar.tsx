'use client';

import ProgressSection from '@/components/postViewer//progressSection';
import AutoAdvanceSection from '@/components/postViewer/autoAdvanceSection';
import ExitFullscreenButton from '@/components/postViewer/exitFullscreenButton';
import PageIndicatorSection from '@/components/postViewer/pageIndicatorSection';
import TTSSection from '@/components/postViewer/ttsSection';
import { toProps as toPostViewerProps } from '@/features/postViewer/domain/model/postViewer';
import { Page } from '@/features/postViewer/domain/types/page';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function PostViewerControlBar({ page }: { page: Page | null }) {
  const postViewer = useSelector((state: RootState) => state.postViewer);

  const { areBarsVisible } = useMemo(
    () => toPostViewerProps(postViewer),
    [postViewer]
  );

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white/80 backdrop-blur-md px-10',
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
