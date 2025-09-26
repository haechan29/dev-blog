'use client';

import { toProps as toPostViewerProps } from '@/features/postViewer/domain/model/postViewer';
import { RootState } from '@/lib/redux/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function PageIndicatorSection() {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { pageNumber, totalPages } = useMemo(
    () => toPostViewerProps(postViewer),
    [postViewer]
  );

  return (
    pageNumber !== null &&
    totalPages !== null && (
      <div className='flex items-center text-sm whitespace-nowrap mr-4'>
        <span>{pageNumber}</span>
        <span className='mx-1'>/</span>
        <span>{totalPages}</span>
      </div>
    )
  );
}
