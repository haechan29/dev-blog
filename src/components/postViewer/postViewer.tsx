'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import useViewerFullscreen from '@/features/postViewer/hooks/useViewerFullscreen';
import useViewerHandler from '@/features/postViewer/hooks/useViewerHandler';
import useViewerTransition from '@/features/postViewer/hooks/useViewerTransition';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';

export default function PostViewer({ post }: { post: PostProps }) {
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  useViewerFullscreen(postViewerRef);
  useViewerTransition(postViewerRef);

  const { page } = usePostParsing();
  const { onMouseMove } = useViewerHandler();

  return (
    <div
      ref={postViewerRef}
      onMouseMove={onMouseMove}
      className='w-screen h-dvh inset-0 fixed z-40 bg-white opacity-0 pointer-events-none'
    >
      <Toaster toasterId='post-viewer' />

      <PostViewerToolbar {...post} />
      <PostViewerContainer page={page} />
      <PostViewerControlBar page={page} />
    </div>
  );
}
