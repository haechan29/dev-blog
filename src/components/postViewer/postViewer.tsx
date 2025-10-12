'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { Page } from '@/features/postViewer/domain/types/page';
import useViewerFullscreen from '@/features/postViewer/hooks/useViewerFullscreen';
import useViewerHandler from '@/features/postViewer/hooks/useViewerHandler';
import useViewerTransition from '@/features/postViewer/hooks/useViewerTransition';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';

export default function PostViewer({
  post,
  page,
}: {
  post: PostProps;
  page: Page | null;
}) {
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  useViewerFullscreen(postViewerRef);
  useViewerTransition(postViewerRef);
  const { onMouseMove } = useViewerHandler();

  return (
    <div
      ref={postViewerRef}
      onMouseMove={onMouseMove}
      className='w-screen h-dvh fixed inset-0 z-40 bg-white opacity-0 pointer-events-none'
    >
      <Toaster toasterId='post-viewer' />

      <PostViewerToolbar {...post} />
      <PostViewerContainer page={page} />
      <PostViewerControlBar page={page} />
    </div>
  );
}
