'use client';

import Tooltip from '@/components/tooltip';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useTTSPlayer from '@/features/postViewer/hooks/useTTSPlayer';
import useDebounce from '@/hooks/useDebounce';
import {
  nextPage,
  setIsControlBarTouched,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function TTSSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elementIndex, setElementIndex] = useState(0);
  const debounce = useDebounce();
  const dispatch = useDispatch<AppDispatch>();
  const { pageNumber, isViewerMode } = usePostViewer();

  const { startReading, pauseReading, stopReading } = useTTSPlayer({
    onFinishElement: () => setElementIndex(prev => prev + 1),
    onFinishPage: () => dispatch(nextPage()),
  });

  const onClick = useCallback(() => {
    if (isPlaying) pauseReading();
    else startReading(elementIndex);

    setIsPlaying(prev => !prev);
    dispatch(setIsControlBarTouched(true));
    debounce(() => dispatch(setIsControlBarTouched(false)), 2000);
  }, [debounce, dispatch, elementIndex, isPlaying, pauseReading, startReading]);

  useEffect(() => {
    if (isPlaying) startReading(elementIndex);
    else pauseReading();
  }, [elementIndex, isPlaying, pauseReading, startReading]);

  useEffect(() => {
    if (!isViewerMode) {
      stopReading();
      setIsPlaying(false);
    }
  }, [isViewerMode, stopReading]);

  useEffect(() => {
    setElementIndex(0);
  }, [pageNumber]);

  return (
    <Tooltip text='음성 재생'>
      <button
        onClick={onClick}
        className={clsx(
          'w-10 h-10 p-2 relative cursor-pointer',
          'transition-opacity|discrete duration-300 ease-in-out'
        )}
        aria-label='음성 재생'
      >
        <Play
          className={clsx(
            'w-6 h-6 absolute inset-0 m-auto stroke-1 text-white md:text-gray-900 transition-opacity duration-300 ease-in-out',
            isPlaying && 'opacity-0 pointer-events-none'
          )}
        />

        <Pause
          className={clsx(
            'w-6 h-6 absolute inset-0 m-auto stroke-1 text-white md:text-gray-900 transition-opacity duration-300 ease-in-out',
            !isPlaying && 'opacity-0 pointer-events-none'
          )}
        />
      </button>
    </Tooltip>
  );
}
