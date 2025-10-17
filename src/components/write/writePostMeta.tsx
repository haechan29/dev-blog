'use client';

import WritePostPassword from '@/components/write/writePostPassword';
import WritePostTag from '@/components/write/writePostTag';
import WritePostTitle from '@/components/write/writePostTitle';
import { WritePostProps } from '@/features/write/ui/writePostProps';

export default function WritePostMeta(writePost: {
  title: string;
  tags: string;
  password: string;
  invalidField: WritePostProps['invalidField'];
  setTitle: (title: string) => void;
  setTags: (tags: string) => void;
  setPassword: (password: string) => void;
}) {
  return (
    <>
      <WritePostTitle {...writePost} />
      <WritePostTag {...writePost} />
      <WritePostPassword {...writePost} />
    </>
  );
}
