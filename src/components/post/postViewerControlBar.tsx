'use client';

import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { Play } from 'lucide-react';
import { useDispatch } from 'react-redux';

export default function PostViewerControlBar() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className='flex w-full min-w-0 justify-center items-center border-t border-t-gray-200'>
      <button
        onClick={() => dispatch(setIsViewerMode(false))}
        className='flex shrink-0 p-2'
      >
        <Play className='w-6 h-6' />
      </button>
    </div>
  );
}
