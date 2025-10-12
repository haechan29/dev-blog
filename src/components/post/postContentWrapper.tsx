'use client';

import useContentTracker from '@/features/post/hooks/useContentTracker';
import useSwipeTracker from '@/features/post/hooks/useSwipeTracker';
import { PostProps } from '@/features/post/ui/postProps';
import { ReactNode, useRef } from 'react';

export default function PostContentWrapper({
  post,
  children,
}: {
  post: PostProps;
  children: ReactNode;
}) {
  const postContentRef = useRef<HTMLDivElement | null>(null);

  useContentTracker(postContentRef);
  useSwipeTracker(postContentRef);

  return <div ref={postContentRef}>{children}</div>;
}
