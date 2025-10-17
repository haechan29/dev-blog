'use client';

import WritePostEditorWithPreview from '@/components/write/writePostEditorWithPreview';
import WritePostMeta from '@/components/write/writePostMeta';
import { WritePostSteps } from '@/features/write/domain/model/writePostStep';
import { WritePostProps } from '@/features/write/ui/writePostProps';
import clsx from 'clsx';

export default function WritePostContent(writePost: {
  title: string;
  tags: string;
  password: string;
  content: string;
  invalidField: WritePostProps['invalidField'];
  currentStepId: keyof WritePostSteps;
  setTitle: (title: string) => void;
  setTags: (tags: string) => void;
  setPassword: (password: string) => void;
  setContent: (content: string) => void;
}) {
  return (
    <div
      className={clsx(
        'w-[200vw] flex transition-transform duration-300 ease-in-out',
        writePost.currentStepId === 'upload' && '-translate-x-[100vw]'
      )}
    >
      <div className='w-[100vw] px-10 xl:px-20'>
        <WritePostEditorWithPreview {...writePost} />
      </div>
      <div className='w-[100vw] px-10 xl:px-20'>
        <WritePostMeta {...writePost} />
      </div>
    </div>
  );
}
