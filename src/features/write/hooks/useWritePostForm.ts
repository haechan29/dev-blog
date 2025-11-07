'use client';

import { createProps } from '@/features/write/ui/writePostFormProps';
import { RootState } from '@/lib/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useWritePostForm() {
  const writePost = useSelector((state: RootState) => state.writePost);
  const writePostForm = useSelector((state: RootState) => state.writePostForm);
  const [writePostFormProps, setWritePostFormProps] = useState(
    createProps(writePost, writePostForm)
  );

  useEffect(() => {
    const writePostFormProps = createProps(writePost, writePostForm);
    setWritePostFormProps(writePostFormProps);
  }, [writePost, writePostForm]);

  return {
    writePostForm: writePostFormProps,
  } as const;
}
