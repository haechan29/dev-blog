'use client';

import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewerControlBar() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);

  const progress = useMemo(() => {
    return (postViewer.currentIndex / (postViewer.totalPages - 1)) * 100;
  }, [postViewer.currentIndex, postViewer.totalPages]);

  return (
    <div className='fixed -bottom-16 left-0 right-0'>
      <div
        className={clsx(
          'flex w-full flex-col transition-transform duration-300 ease-in-out',
          postViewer.isControlBarVisible && '-translate-y-16'
        )}
      >
        <div className='px-10'>
          <div className='relative w-full h-0.5 bg-gray-200'>
            <div
              className='relative h-0.5 bg-blue-500'
              style={{ width: `${progress}%` }}
            >
              <div className='absolute flex flex-col items-center gap-0.5 -bottom-1 -right-1.5'>
                <div className='flex gap-0.5 text-xs text-black whitespace-norwrap'>
                  <div>{postViewer.currentIndex + 1}</div>
                  <div>/</div>
                  <div>{postViewer.totalPages}</div>
                </div>

                <div className='w-3 h-3 bg-blue-500 rounded-full' />
              </div>
            </div>
          </div>
        </div>

        <div className='flex w-full h-10 overflow-hidden justify-center items-center'>
          <button
            onClick={() => dispatch(setIsViewerMode(false))}
            className='flex shrink-0 p-2'
          >
            <Play className='w-6 h-6' />
          </button>
        </div>
      </div>
    </div>
  );
}
