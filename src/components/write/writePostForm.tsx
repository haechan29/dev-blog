'use client';

import WritePostContent from '@/components/write/writePostContent';
import WritePostMeta from '@/components/write/writePostMeta';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import clsx from 'clsx';

export default function WritePostForm({
  writePostForm: { currentStepId, content, ...meta },
  ...writePostForm
}: ReturnType<typeof useWritePostForm>) {
  return (
    <div className='w-[100vw] h-full overflow-x-hidden'>
      <div
        className={clsx(
          'w-[200vw] h-full flex transition-transform duration-300 ease-in-out',
          currentStepId === 'upload' && '-translate-x-[100vw]'
        )}
      >
        <div className='w-[100vw] h-full px-4 pb-4 lg:px-8 lg:pb-8'>
          <WritePostContent content={content} {...writePostForm} />
        </div>
        <div className='w-[100vw] h-full px-4 md:px-40 lg:56 xl:px-72'>
          <WritePostMeta {...meta} {...writePostForm} />
        </div>
      </div>
    </div>
  );
}
