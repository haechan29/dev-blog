'use client';

import PostViewer from '@/components/postViewer/postViewer';
import useContentTracker from '@/features/post/hooks/useContentTracker';
import useSwipeTracker from '@/features/post/hooks/useSwipeTracker';
import { PostProps } from '@/features/post/ui/postProps';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import { ReactNode, useRef } from 'react';

export default function PostContentWrapper({
  post,
  children,
}: {
  post: PostProps;
  children: ReactNode;
}) {
  const postContentRef = useRef<HTMLDivElement | null>(null);
  const { page } = usePostParsing(postContentRef);
  useContentTracker(postContentRef);
  useSwipeTracker(postContentRef);

  return (
    <>
      <PostViewer post={post} page={page} />
      <div ref={postContentRef} className='prose mb-20'>
        {children}
      </div>
    </>
  );
}
