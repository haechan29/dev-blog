'use client';

import PostViewerContent from '@/components/postViewer/postViewerContent';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { useBarsAutoHide } from '@/features/postViewer/hooks/useBarsAutoHide';
import { useFullscreen } from '@/features/postViewer/hooks/useFullscreen';
import { useFullscreenScale } from '@/features/postViewer/hooks/useFullscreenScale';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import { useViewerNavigation } from '@/features/postViewer/hooks/useViewerNavigation';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function PostViewer({ post }: { post: PostProps }) {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isViewerMode } = useMemo(() => toProps(postViewer), [postViewer]);
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
        !isViewerMode && 'hidden'
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
