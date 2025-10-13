'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { Page } from '@/features/postViewer/domain/types/page';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerFullscreen from '@/features/postViewer/hooks/useViewerFullscreen';
import useViewerHandler from '@/features/postViewer/hooks/useViewerHandler';
import useScrollLock from '@/hooks/useScrollLock';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';

export default function PostViewer({
  post,
  page,
}: {
  post: PostProps;
  page: Page | null;
}) {
  const { isViewerMode } = usePostViewer();
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  const handlers = useViewerHandler();
  useViewerFullscreen(postViewerRef);
  useScrollLock(isViewerMode);

  return (
    <div
      ref={postViewerRef}
      {...handlers}
      className='w-screen h-dvh fixed inset-0 z-40 bg-white opacity-0 pointer-events-none'
    >
      <Toaster toasterId='post-viewer' />

      <PostViewerToolbar {...post} />
      <PostViewerContainer page={page} />
      <PostViewerControlBar page={page} />
    </div>
  );
}
