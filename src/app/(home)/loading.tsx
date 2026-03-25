import clsx from 'clsx';

function PostPreviewSkeleton() {
  return (
    <div className='flex flex-col gap-4 mb-8'>
      <div className='h-7 sm:h-8 bg-gray-200 rounded animate-pulse w-2/3' />

      <div className='flex flex-col gap-2 h-18'>
        <div className='h-4 bg-gray-100 rounded animate-pulse w-full' />
        <div className='h-4 bg-gray-100 rounded animate-pulse w-11/12' />
        <div className='h-4 bg-gray-100 rounded animate-pulse w-4/5' />
      </div>

      <div className='flex items-center gap-2'>
        <div className='w-6 h-6 rounded-full bg-gray-200 animate-pulse' />
        <div className='h-3 w-16 bg-gray-200 rounded animate-pulse' />
        <div className='w-[3px] h-[3px] rounded-full bg-gray-300' />
        <div className='h-3 w-20 bg-gray-100 rounded animate-pulse' />
      </div>

      <div className='h-px bg-gray-200' />
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div
      className={clsx(
        'mt-(--toolbar-height) mb-8 px-6 md:px-12 xl:px-18',
        'xl:ml-(--sidebar-width)',
        'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
      )}
    >
      <div className='flex flex-col mt-8'>
        <PostPreviewSkeleton />
        <PostPreviewSkeleton />
        <PostPreviewSkeleton />
        <PostPreviewSkeleton />
      </div>
    </div>
  );
}
