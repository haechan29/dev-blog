'use client';

import { toProps as toPostViewerProps } from '@/features/postViewer/domain/model/postViewer';
import { RootState } from '@/lib/redux/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function ProgressSection() {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { pageIndex, totalPages } = useMemo(
    () => toPostViewerProps(postViewer),
    [postViewer]
  );

  const progress = useMemo(() => {
    return (pageIndex / (totalPages - 1)) * 100;
  }, [pageIndex, totalPages]);

  return (
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
  );
}
