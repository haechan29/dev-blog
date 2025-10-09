'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { useClickTouchNavigation as useClickTouchNavigationHandlers } from '@/features/postViewer/hooks/useClickTouchNavigation';
import useKeyboardWheelNavigation from '@/features/postViewer/hooks/useKeyboardWheelNavigation';
import usePostParsing from '@/features/postViewer/hooks/usePostParsing';
import useViewerFullscreen from '@/features/postViewer/hooks/useViewerFullscreen';
import useViewerTransition from '@/features/postViewer/hooks/useViewerTransition';
import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import { canTouch } from '@/lib/browser';
import { setIsMouseMoved } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export default function PostViewer({ post }: { post: PostProps }) {
  const dispatch = useDispatch<AppDispatch>();

  const postViewerRef = useRef<HTMLDivElement | null>(null);
  const throttle = useThrottle();
  const debounce = useDebounce();

  const handleMouseMove = useCallback(() => {
    if (canTouch) return;

    throttle(() => {
      dispatch(setIsMouseMoved(true));
      debounce(() => dispatch(setIsMouseMoved(false)), 2000);
    }, 100);
  }, [debounce, dispatch, throttle]);

  const { page } = usePostParsing();

  const navigationHandlers = useClickTouchNavigationHandlers();
  useKeyboardWheelNavigation();

  useViewerFullscreen(postViewerRef);
  useViewerTransition(postViewerRef);

  return (
    <div
      ref={postViewerRef}
      onMouseMove={handleMouseMove}
      className='w-screen h-dvh inset-0 fixed z-40 bg-white opacity-0 pointer-events-none'
    >
      <Toaster toasterId='post-viewer' />

      <PostViewerToolbar {...post} />
      <PostViewerContainer page={page} {...navigationHandlers} />
      <PostViewerControlBar page={page} />
    </div>
  );
}
