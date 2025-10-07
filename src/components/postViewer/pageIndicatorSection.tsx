'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';

export default function PageIndicatorSection() {
  const { pageNumber, totalPages } = usePostViewer();

  return (
    pageNumber !== null &&
    totalPages !== null && (
      <div className='flex items-center text-sm whitespace-nowrap mr-4'>
        <span>{pageNumber}</span>
        <span className='mx-1'>/</span>
        <span>{totalPages - 1}</span>
      </div>
    )
  );
}
