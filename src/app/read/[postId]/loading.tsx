import clsx from 'clsx';

export default function PostLoading() {
  return (
    <>
      <div className='fixed top-0 z-40 w-full h-(--toolbar-height) bg-white/80 backdrop-blur-md' />

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-12 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <div className='max-w-[65ch] mx-auto'>
          <div className='flex flex-col gap-6 mb-10'>
            <div className='h-9 bg-gray-200 rounded animate-pulse w-3/4' />

            <div className='flex gap-3'>
              <div className='h-6 w-14 bg-gray-100 rounded-full animate-pulse' />
              <div className='h-6 w-16 bg-gray-100 rounded-full animate-pulse' />
              <div className='h-6 w-12 bg-gray-100 rounded-full animate-pulse' />
            </div>

            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 rounded-full bg-gray-200 animate-pulse' />
              <div className='h-3 w-16 bg-gray-200 rounded animate-pulse' />
              <div className='w-[3px] h-[3px] rounded-full bg-gray-300' />
              <div className='h-3 w-20 bg-gray-100 rounded animate-pulse' />
            </div>
          </div>

          <div className='w-full h-px bg-gray-200 mb-10' />

          <div className='flex flex-col gap-4'>
            <div className='h-4 bg-gray-100 rounded animate-pulse w-full' />
            <div className='h-4 bg-gray-100 rounded animate-pulse w-11/12' />
            <div className='h-4 bg-gray-100 rounded animate-pulse w-4/5' />
            <div className='h-4 bg-gray-100 rounded animate-pulse w-full' />
            <div className='h-4 bg-gray-100 rounded animate-pulse w-3/4' />
            <div className='h-4 bg-gray-100 rounded animate-pulse w-5/6' />
            <div className='h-4 bg-gray-100 rounded animate-pulse w-full' />
            <div className='h-4 bg-gray-100 rounded animate-pulse w-2/3' />
          </div>
        </div>
      </div>
    </>
  );
}
