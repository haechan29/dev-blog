'use client';

import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewerControlBar() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);

  return (
    <div className='fixed bottom-0 left-0 right-0 h-10'>
      <div
        className={clsx(
          'flex w-full overflow-hidden justify-center items-center transition-discrete duration-300 ease-in-out',
          postViewer.isControlBarVisible
            ? 'h-10 border-t border-t-gray-200'
            : 'h-0'
        )}
      >
        <button
          onClick={() => dispatch(setIsViewerMode(false))}
          className='flex shrink-0 p-2'
        >
          <Play className='w-6 h-6' />
        </button>
      </div>
    </div>
  );
}
