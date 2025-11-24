'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { setIsViewerMode } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { Maximize } from 'lucide-react';
import { useDispatch } from 'react-redux';

export default function EnterFullscreenButton() {
  const dispatch = useDispatch<AppDispatch>();
  const { isButtonVisible } = usePostViewer();

  return (
    <button
      onClick={() => {
        dispatch(setIsViewerMode(true));
      }}
      className={clsx(
        'fixed bottom-4 right-4 xl:bottom-10 xl:right-10 flex shrink-0 justify-center items-center rounded-full cursor-pointer',
        'bg-white shadow-lg p-3 border border-gray-100 transition-opacity duration-300 ease-in-out',
        isButtonVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <Maximize className='w-6 h-6 text-black stroke-2 hover:animate-pop' />
    </button>
  );
}
