'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useDebounce from '@/hooks/useDebounce';
import { setIsMouseMoved, setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { Maximize } from 'lucide-react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function EnterFullscreenButton() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = usePostViewer();

  const debounce = useDebounce();

  const handleClick = useCallback(() => {
    dispatch(setIsMouseMoved(true));
    debounce(() => dispatch(setIsMouseMoved(false)), 2000);

    dispatch(setIsViewerMode(true));
  }, [debounce, dispatch]);

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'fixed bottom-4 right-4 xl:bottom-10 xl:right-10 flex shrink-0 justify-center items-center rounded-full cursor-pointer',
        'bg-white shadow-lg p-3 border border-gray-100 transition-opacity duration-300 ease-in-out',
        postViewer.isButtonVisible
          ? 'opacity-100'
          : 'opacity-0 pointer-events-none'
      )}
    >
      <Maximize className='w-6 h-6 text-black stroke-2 hover:animate-pop' />
    </button>
  );
}
