'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';

export default function PageIndicatorSection() {
  const { pageNumber, totalPages } = usePostViewer();

  return (
    pageNumber !== null &&
    totalPages !== null && (
      <div className='flex items-center text-sm text-white md:text-gray-900 whitespace-nowrap gap-1'>
        <span>{pageNumber}</span>
        <span>/</span>
        <span>{totalPages - 1}</span>
      </div>
    )
  );
}
