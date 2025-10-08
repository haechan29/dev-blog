'use client';

import PostViewerContent from '@/components/postViewer/postViewerContent';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { useFullscreenScale } from '@/features/postViewer/hooks/useFullscreenScale';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { useViewerFullscreen } from '@/features/postViewer/hooks/useViewerFullscreen';
import { useViewerNavigation } from '@/features/postViewer/hooks/useViewerNavigation';
import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import { setIsMouseMoved } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export default function PostViewer({ post }: { post: PostProps }) {
  const dispatch = useDispatch<AppDispatch>();

  const { isViewerMode } = usePostViewer();
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  const postViewerContentRef = useRef<HTMLDivElement | null>(null);
  const throttle = useThrottle();
  const debounce = useDebounce();

  const { page } = usePostParsing();

  useFullscreenScale();
  useViewerFullscreen(postViewerRef);
  useViewerNavigation(postViewerContentRef);

  return (
    <div
      ref={postViewerRef}
      onMouseMove={() => {
        throttle(() => {
          dispatch(setIsMouseMoved(true));
          debounce(() => dispatch(setIsMouseMoved(false)), 2000);
        }, 100);
      }}
      className={clsx(
        'w-screen h-dvh fixed inset-0 flex flex-col overflow-auto bg-white',
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
