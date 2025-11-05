'use client';

import PostViewer from '@/components/postViewer/postViewer';
import useContentTracker from '@/features/post/hooks/useContentTracker';
import useHeadingSync from '@/features/post/hooks/useHeadingSync';
import useScrollTracker from '@/features/post/hooks/useScrollTracker';
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
  useScrollTracker();
  useHeadingSync(postContentRef, post);

  return (
    <>
      <PostViewer post={post} page={page} />
      <div ref={postContentRef} className='mb-20'>
        {children}
      </div>
    </>
  );
}
