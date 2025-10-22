'use client';

import WritePostPassword from '@/components/write/writePostPassword';
import WritePostTag from '@/components/write/writePostTag';
import WritePostTitle from '@/components/write/writePostTitle';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';

export default function WritePostMeta(writePost: {
  writePostForm: WritePostFormProps;
  writePostValidity: WritePostValidityProps;
  setTitle: (title: string) => void;
  setTags: (tags: string[]) => void;
  setPassword: (password: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  return (
    <div className='flex flex-col gap-4'>
      <WritePostTitle {...writePost} />
      <WritePostTag {...writePost} />
      <WritePostPassword {...writePost} />
    </div>
  );
}
