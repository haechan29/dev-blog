'use client';

import PostViewer from '@/components/postViewer/postViewer';
import useContentTracker from '@/features/post/hooks/useContentTracker';
import useHeadingSync from '@/features/post/hooks/useHeadingSync';
import useScrollTracker from '@/features/post/hooks/useScrollTracker';
import { PostProps } from '@/features/post/ui/postProps';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import { RootState } from '@/lib/redux/store';
import { ReactNode, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function PostContentWrapper({
  post,
  parsed,
  raw,
}: {
  post: PostProps;
  parsed: ReactNode;
  raw: ReactNode;
}) {
  const postContentRef = useRef<HTMLDivElement | null>(null);
  const { page } = usePostParsing(postContentRef);
  const postReader = useSelector((state: RootState) => state.postReader);

  useContentTracker(postContentRef);
  useScrollTracker();
  useHeadingSync(postContentRef, post);

  return (
    <>
      <PostViewer post={post} page={page} />
      <div className='mb-20'>
        {postReader.mode === 'raw' ? (
          <div>{raw}</div>
        ) : (
          <div ref={postContentRef}>{parsed}</div>
        )}
      </div>
    </>
  );
}
