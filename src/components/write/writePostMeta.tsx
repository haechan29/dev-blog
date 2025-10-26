'use client';

import WritePostPassword from '@/components/write/writePostPassword';
import WritePostTag from '@/components/write/writePostTag';
import WritePostTitle from '@/components/write/writePostTitle';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';

export default function WritePostMeta(writePostForm: {
  title: WritePostFormProps['title'];
  tags: WritePostFormProps['tags'];
  password: WritePostFormProps['password'];
  setTitle: (title: string) => void;
  setTags: (tags: string[]) => void;
  setPassword: (password: string) => void;
  resetInvalidField: () => void;
}) {
  return (
    <div className='flex flex-col gap-4'>
      <WritePostTitle {...writePostForm} />
      <WritePostTag {...writePostForm} />
      <WritePostPassword {...writePostForm} />
    </div>
  );
}
