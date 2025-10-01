'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { useMemo } from 'react';

export default function ProgressSection() {
  const { pageNumber, totalPages } = usePostViewer();

  const progress = useMemo(() => {
    if (!pageNumber || !totalPages) return null;
    return ((pageNumber - 1) / (totalPages - 2)) * 100;
  }, [pageNumber, totalPages]);

  return (
    progress !== null && (
      <div className='mb-3'>
        <div className='relative w-full h-0.5 bg-gray-200'>
          <div
            className='relative h-0.5 bg-blue-500'
            style={{ width: `${progress}%` }}
          >
            <div className='absolute w-3 h-3 -top-1 -right-1.5 bg-blue-500 rounded-full' />
          </div>
        </div>
      </div>
    )
  );
}
