'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { useClickTouchNavigation as useClickTouchNavigationHandlers } from '@/features/postViewer/hooks/useClickTouchNavigation';
import useKeyboardWheelNavigation from '@/features/postViewer/hooks/useKeyboardWheelNavigation';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { useViewerFullscreen } from '@/features/postViewer/hooks/useViewerFullscreen';
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
  const throttle = useThrottle();
  const debounce = useDebounce();

  const { page } = usePostParsing();

  const navigationHandlers = useClickTouchNavigationHandlers();
  useKeyboardWheelNavigation();

  useViewerFullscreen(postViewerRef);

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
        'w-screen h-dvh fixed inset-0 bg-white',
        !isViewerMode && 'hidden'
      )}
    >
      <Toaster toasterId='post-viewer' />

      <PostViewerToolbar {...post} />
      <PostViewerContainer page={page} {...navigationHandlers} />
      <PostViewerControlBar page={page} />
    </div>
  );
}
