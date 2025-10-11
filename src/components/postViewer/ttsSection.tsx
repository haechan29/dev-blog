'use client';

import TooltipItem from '@/components/tooltipItem';
import { isReadable } from '@/features/postViewer/domain/lib/tts';
import { Page } from '@/features/postViewer/domain/types/page';
import useTTSPlayer from '@/features/postViewer/hooks/useTTSPlayer';
import useTTSState from '@/features/postViewer/hooks/useTTSState';
import { nextPage } from '@/lib/redux/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { Headphones, Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function TTSSection({ page }: { page: Page | null }) {
  const dispatch = useDispatch<AppDispatch>();

  const readablePage = useMemo(() => page?.filter(isReadable) ?? [], [page]);

  const {
    ttsProps,
    onEnableButtonClick,
    onPlayButtonClick,
    increaseElementIndex,
  } = useTTSState();

  const onFinishPage = useCallback(() => dispatch(nextPage()), [dispatch]);

  const { startReading, pauseReading, stopReading } = useTTSPlayer({
    readablePage,
    onFinishElement: increaseElementIndex,
    onFinishPage,
  });

  useEffect(() => {
    if (ttsProps.mode === 'disabled') stopReading();
    else if (ttsProps.mode === 'enabled' && ttsProps.isPlaying)
      startReading(ttsProps.elementIndex);
    else if (ttsProps.mode === 'enabled' && !ttsProps.isPlaying) pauseReading();
  }, [pauseReading, startReading, stopReading, ttsProps]);

  return (
    <div className='flex items-center'>
      <TooltipItem text='음성'>
        <button
          onClick={onEnableButtonClick}
          className='relative flex shrink-0 items-center p-2 cursor-pointer'
          aria-label='음성 재생'
        >
          <Headphones
            className={clsx(
              'icon',
              ttsProps.mode === 'enabled' ? 'text-gray-900' : 'text-gray-400'
            )}
          />
          <div
            className={clsx(
              'absolute top-2 right-1.5 flex justify-center items-center w-3 h-3 rounded-full',
              ttsProps.mode === 'enabled' && 'bg-white'
            )}
          >
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                ttsProps.mode === 'enabled' && 'bg-blue-500'
              )}
            />
          </div>
        </button>
      </TooltipItem>

      <button
        onClick={onPlayButtonClick}
        className={clsx(
          'relative cursor-pointer overflow-hidden',
          'transition-opacity|discrete duration-300 ease-in-out',
          ttsProps.mode === 'enabled'
            ? 'w-9 h-9 md:w-10 md:h-10 p-2 ml-2'
            : 'w-0 h-0 opacity-0 pointer-events-none'
        )}
        aria-label='음성 일시정지'
      >
        <Play
          className={clsx(
            'absolute icon m-auto inset-0 transition-opacity duration-300 button ease-in-out',
            ttsProps.mode === 'enabled' &&
              ttsProps.isPlaying &&
              'opacity-0 pointer-events-none'
          )}
        />

        <Pause
          className={clsx(
            'absolute icon m-auto inset-0 transition-opacity duration-300 ease-in-out',
            ttsProps.mode === 'enabled' &&
              !ttsProps.isPlaying &&
              'opacity-0 pointer-events-none'
          )}
        />
      </button>
    </div>
  );
}
