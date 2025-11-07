'use client';

import { createProps } from '@/features/post/ui/writePostProps';
import { RootState } from '@/lib/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useWritePost() {
  const writePost = useSelector((state: RootState) => state.writePost);

  const [writePostProps, setWritePostProps] = useState(createProps(writePost));

  useEffect(() => {
    const writePostProps = createProps(writePost);
    setWritePostProps(writePostProps);
  }, [writePost]);

  return {
    writePost: writePostProps,
  } as const;
}
