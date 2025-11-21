'use client';

import Tooltip from '@/components/tooltip';
import useTTSPlayer from '@/features/postViewer/hooks/useTTSPlayer';
import useDebounce from '@/hooks/useDebounce';
import { setIsControlBarTouched } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function TTSSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const debounce = useDebounce();
  const dispatch = useDispatch<AppDispatch>();
  const isViewerMode = useSelector((state: RootState) => {
    return state.postViewer.isViewerMode;
  });

  useEffect(() => {
    if (!isViewerMode) setIsPlaying(false);
  }, [isViewerMode]);

  useTTSPlayer({ isPlaying });

  return (
    <Tooltip text='음성 재생'>
      <button
        onClick={() => {
          setIsPlaying(prev => !prev);
          dispatch(setIsControlBarTouched(true));
          debounce(() => dispatch(setIsControlBarTouched(false)), 2000);
        }}
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
