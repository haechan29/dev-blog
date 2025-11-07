'use client';

import { createProps } from '@/features/write/ui/writePostFormProps';
import { RootState } from '@/lib/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useWritePostForm() {
  const writePostForm = useSelector((state: RootState) => state.writePostForm);
  const [writePostFormProps, setWritePostFormProps] = useState(
    createProps(writePostForm)
  );

  useEffect(() => {
    const writePostFormProps = createProps(writePostForm);
    setWritePostFormProps(writePostFormProps);
  }, [writePostForm]);

  return {
    writePostForm: writePostFormProps,
  } as const;
}
