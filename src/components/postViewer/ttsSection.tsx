'use client';

import TooltipItem from '@/components/tooltipItem';
import { isReadable } from '@/features/postViewer/domain/lib/tts';
import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useTTSPlayer from '@/features/postViewer/hooks/useTTSPlayer';
import useTTSState from '@/features/postViewer/hooks/useTTSState';
import { nextPage } from '@/lib/redux/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function TTSSection({ page }: { page: Page | null }) {
  const dispatch = useDispatch<AppDispatch>();

  const { isViewerMode } = usePostViewer();

  const readablePage = useMemo(() => page?.filter(isReadable) ?? [], [page]);

  const { ttsProps, onPlayButtonClick, increaseElementIndex } = useTTSState();

  const onFinishPage = useCallback(() => dispatch(nextPage()), [dispatch]);

  const { startReading, pauseReading, stopReading } = useTTSPlayer({
    readablePage,
    onFinishElement: increaseElementIndex,
    onFinishPage,
  });

  useEffect(() => {
    if (ttsProps.isPlaying) startReading(ttsProps.elementIndex);
    else pauseReading();
  }, [pauseReading, startReading, stopReading, ttsProps]);

  useEffect(() => {
    if (!isViewerMode) stopReading();
  }, [isViewerMode, stopReading]);

  return (
    <TooltipItem text='음성 재생'>
      <button
        onClick={onPlayButtonClick}
        className={clsx(
          'w-10 h-10 p-2 ml-2 relative cursor-pointer',
          'transition-opacity|discrete duration-300 ease-in-out'
        )}
        aria-label='음성 재생'
      >
        <Play
          className={clsx(
            'w-6 h-6 absolute inset-0 m-auto stroke-1 text-white transition-opacity duration-300 ease-in-out',
            ttsProps.isPlaying && 'opacity-0 pointer-events-none'
          )}
        />

        <Pause
          className={clsx(
            'w-6 h-6 absolute inset-0 m-auto stroke-1 text-white transition-opacity duration-300 ease-in-out',
            !ttsProps.isPlaying && 'opacity-0 pointer-events-none'
          )}
        />
      </button>
    </TooltipItem>
  );
}
