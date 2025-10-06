'use client';

import PostViewerContent from '@/components/postViewer/postViewerContent';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { useBarsAutoHide } from '@/features/postViewer/hooks/useBarsAutoHide';
import { useFullscreen } from '@/features/postViewer/hooks/useFullscreen';
import { useFullscreenScale } from '@/features/postViewer/hooks/useFullscreenScale';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { useViewerNavigation } from '@/features/postViewer/hooks/useViewerNavigation';
import clsx from 'clsx';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';

export default function PostViewer({ post }: { post: PostProps }) {
  const { isViewerMode } = usePostViewer();
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  const postViewerContentRef = useRef<HTMLDivElement | null>(null);

  const { page } = usePostParsing();

  useFullscreenScale();
  useFullscreen(postViewerRef);
  useViewerNavigation(postViewerContentRef);
  useBarsAutoHide();

  return (
    <div
      ref={postViewerRef}
      className={clsx(
        'bg-white flex flex-col w-screen h-screen',
        !isViewerMode && 'invisible'
      )}
    >
      <Toaster toasterId='post-viewer' />

      <PostViewerToolbar {...post} />
      <PostViewerContent
        page={page}
        postViewerContentRef={postViewerContentRef}
      />
      <PostViewerControlBar page={page} />
    </div>
  );
}
