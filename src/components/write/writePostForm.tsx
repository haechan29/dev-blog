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
    <div
      className={clsx(
        'w-[200vw] flex transition-transform duration-300 ease-in-out',
        writePost.writePost.currentStepId === 'upload' && '-translate-x-[100vw]'
      )}
    >
      <div className='w-[100vw] px-10 xl:px-20'>
        <WritePostContent {...writePost} />
      </div>
      <div className='w-[100vw] px-10 xl:px-20'>
        <WritePostMeta {...writePost} />
      </div>
    </div>
  );
}
