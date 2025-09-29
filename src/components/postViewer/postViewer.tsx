'use client';

import PostViewerContent from '@/components/postViewer/postViewerContent';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostItemProps } from '@/features/post/ui/postItemProps';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { useControlBarAutoHide } from '@/features/postViewer/hooks/useControlBarAutoHide';
import { useFullscreen } from '@/features/postViewer/hooks/useFullscreen';
import { useFullscreenScale } from '@/features/postViewer/hooks/useFullscreenScale';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import { useViewerNavigation } from '@/features/postViewer/hooks/useViewerNavigation';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function PostViewer({
  postProps,
}: {
  postProps: PostItemProps;
}) {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isViewerMode } = useMemo(() => toProps(postViewer), [postViewer]);
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  const postViewerContentRef = useRef<HTMLDivElement | null>(null);

  const { page } = usePostParsing();

  useFullscreenScale();
  useFullscreen(postViewerRef);
  useViewerNavigation(postViewerContentRef);
  useControlBarAutoHide();

  return (
    <>
      <Toaster toasterId='post-viewer' />
      <div
        ref={postViewerRef}
        className={clsx(
          'bg-white flex flex-col w-screen',
          !isViewerMode && 'hidden'
        )}
      >
        <PostViewerToolbar {...postProps} />
        <PostViewerContent
          page={page}
          postViewerContentRef={postViewerContentRef}
        />
        <PostViewerControlBar page={page} />
      </div>
    </>
  );
}
