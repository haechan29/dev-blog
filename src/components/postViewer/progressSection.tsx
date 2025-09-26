'use client';

import { toProps as toPostViewerProps } from '@/features/postViewer/domain/model/postViewer';
import { RootState } from '@/lib/redux/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function ProgressSection() {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { pageNumber, totalPages } = useMemo(
    () => toPostViewerProps(postViewer),
    [postViewer]
  );

  const progress = useMemo(() => {
    if (!pageNumber || !totalPages) return null;
    return ((pageNumber - 1) / (totalPages - 1)) * 100;
  }, [pageNumber, totalPages]);

  return (
    progress !== null && (
      <div className='px-10'>
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
