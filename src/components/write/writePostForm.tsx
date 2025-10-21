'use client';

import WritePostContent from '@/components/write/writePostContent';
import WritePostMeta from '@/components/write/writePostMeta';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostProps } from '@/features/write/ui/writePostProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';

export default function WritePostForm(writePost: {
  writePost: WritePostProps;
  writePostForm: WritePostFormProps;
  writePostValidity: WritePostValidityProps;
  setContent: (content: string) => void;
  setTitle: (title: string) => void;
  setTags: (tags: string) => void;
  setPassword: (password: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  return (
    <div className='w-[100vw] h-full overflow-x-hidden'>
      <div
        className={clsx(
          'w-[200vw] h-full flex transition-transform duration-300 ease-in-out',
          writePost.writePost.currentStepId === 'upload' &&
            '-translate-x-[100vw]'
        )}
      >
        <div className='w-[100vw] h-full px-4 lg:px-8 lg:pb-8'>
          <WritePostContent {...writePost} />
        </div>
        <div className='w-[100vw] h-full px-4 md:px-40 lg:56 xl:px-72'>
          <WritePostMeta {...writePost} />
        </div>
      </div>
    </div>
  );
}
