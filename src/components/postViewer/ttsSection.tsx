'use client';

import TooltipItem from '@/components/tooltipItem';
import { Page } from '@/features/postViewer/domain/types/page';
import useTTSPlayer from '@/features/postViewer/hooks/useTTSPlayer';
import useTTSState from '@/features/postViewer/hooks/useTTSState';
import { nextPage } from '@/lib/redux/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { Headphones, Pause, Play } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function TTSSection({ page }: { page: Page | null }) {
  const dispatch = useDispatch<AppDispatch>();

  const { ttsProps, toggleIsEnabled, toggleIsPlaying, increaseElementIndex } =
    useTTSState();

  const onFinishPage = useCallback(() => dispatch(nextPage()), [dispatch]);

  const { startReading, pauseReading, stopReading } = useTTSPlayer({
    page,
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
    <div className='flex items-center gap-2'>
      <TooltipItem text='음성'>
        <button
          onClick={toggleIsEnabled}
          className='relative flex shrink-0 items-center p-2 cursor-pointer'
          aria-label='음성 재생'
        >
          <Headphones
            className={clsx(
              'w-6 h-6',
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

      <div
        className={clsx(
          'flex items-center',
          'transition-opacity duration-300 ease-in-out',
          ttsProps.mode !== 'enabled' && 'opacity-0 pointer-events-none'
        )}
      >
        <button
          onClick={toggleIsPlaying}
          className={clsx(
            'flex items-center cursor-pointer',
            'transition-discrete duration-300 ease-in-out',
            ttsProps.mode === 'enabled' ? 'w-10 p-2' : 'w-0 overflow-hidden'
          )}
          aria-label='음성 일시정지'
        >
          <div className='relative w-6 h-6'>
            <Play
              className={clsx(
                'absolute inset-0 transition-opacity duration-300 button ease-in-out',
                ttsProps.mode === 'enabled' &&
                  ttsProps.isPlaying &&
                  'opacity-0 pointer-events-none'
              )}
            />

            <Pause
              className={clsx(
                'absolute inset-0 transition-opacity duration-300 ease-in-out',
                ttsProps.mode === 'enabled' &&
                  !ttsProps.isPlaying &&
                  'opacity-0 pointer-events-none'
              )}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
