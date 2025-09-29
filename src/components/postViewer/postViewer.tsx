'use client';

import PostViewerContent from '@/components/postViewer/postViewerContent';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { useControlBarAutoHide } from '@/features/postViewer/hooks/useControlBarAutoHide';
import { useFullscreen } from '@/features/postViewer/hooks/useFullscreen';
import { useViewerNavigation } from '@/features/postViewer/hooks/useViewerNavigation';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function PostViewer() {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isViewerMode } = useMemo(() => toProps(postViewer), [postViewer]);
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  const postViewerContentRef = useRef<HTMLDivElement | null>(null);

  useFullscreen(postViewerRef);
  useViewerNavigation(postViewerContentRef);
  useControlBarAutoHide();

  return (
    <div
      ref={postViewerRef}
      className={clsx('bg-white flex flex-col', !isViewerMode && 'hidden')}
    >
      <PostViewerContent postViewerContentRef={postViewerContentRef} />
      <PostViewerControlBar postViewerContentRef={postViewerContentRef} />
      <Toaster toasterId='post-viewer' />
    </div>
  );
}
