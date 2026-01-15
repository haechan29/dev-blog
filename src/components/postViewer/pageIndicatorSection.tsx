'use client';

export default function PageIndicatorSection({
  pageNumber,
  totalPages,
}: {
  pageNumber: number | null;
  totalPages: number;
}) {
  return (
    pageNumber !== null && (
      <div className='flex items-center text-sm text-white md:text-gray-900 whitespace-nowrap gap-1'>
        <span>{pageNumber}</span>
        <span>/</span>
        <span>{totalPages - 1}</span>
      </div>
    )
  );
}
