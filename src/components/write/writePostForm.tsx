'use client';

import WritePostContent from '@/components/write/writePostContent';
import WritePostPassword from '@/components/write/writePostPassword';
import WritePostTag from '@/components/write/writePostTag';
import WritePostTitle from '@/components/write/writePostTitle';
import useWritePost from '@/features/write/hooks/useWritePost';
import clsx from 'clsx';

export default function WritePostForm() {
  const {
    writePost: {
      writePostForm: { currentStepId },
    },
  } = useWritePost();

  return (
    <div className='w-[100vw] h-full overflow-x-hidden'>
      <div
        className={clsx(
          'w-[200vw] h-full flex transition-transform duration-300 ease-in-out',
          currentStepId === 'upload' && '-translate-x-[100vw]'
        )}
      >
        <div className='w-[100vw] h-full px-4 pb-4 lg:px-8 lg:pb-8'>
          <WritePostContent />
        </div>

        <div className='w-[100vw] h-full flex flex-col gap-4 px-4 md:px-40 lg:56 xl:px-72'>
          <WritePostTitle />
          <WritePostTag />
          <WritePostPassword />
        </div>
      </div>
    </div>
  );
}
