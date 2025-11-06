'use client';

import { createProps } from '@/features/post/ui/postReaderProps';
import { RootState } from '@/lib/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function usePostReader() {
  const postReader = useSelector((state: RootState) => state.postReader);

  const [postReaderProps, setPostReaderProps] = useState(
    createProps(postReader)
  );

  useEffect(() => {
    const postReaderProps = createProps(postReader);
    setPostReaderProps(postReaderProps);
  }, [postReader]);

  return {
    postReader: postReaderProps,
  } as const;
}
