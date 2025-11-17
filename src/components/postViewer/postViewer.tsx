'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerFullscreen from '@/features/postViewer/hooks/useViewerFullscreen';
import useDebounce from '@/hooks/useDebounce';
import useScrollLock from '@/hooks/useScrollLock';
import useThrottle from '@/hooks/useThrottle';
import { canTouch } from '@/lib/browser';
import { processMd } from '@/lib/md/md';
import {
  setIsMouseMoved,
  setIsRotationFinished,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { JSX, TransitionEvent, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export default function PostViewer({ post }: { post: PostProps }) {
  const dispatch = useDispatch<AppDispatch>();
  const throttle = useThrottle();
  const debounce = useDebounce();

  const { isViewerMode } = usePostViewer();
  const [result, setResult] = useState<JSX.Element | null>(null);

  useViewerFullscreen();
  useScrollLock({ isLocked: isViewerMode });

  useEffect(() => {
    const render = async () => {
      await processMd({ source: post.content, mode: 'viewer' }).then(result => {
        setResult(result);
      });
    };
    render();
  }, [post.content]);

  return (
    <>
      <div
        data-post-viewer
        onMouseMove={() => {
          if (canTouch) return;
          throttle(() => {
            dispatch(setIsMouseMoved(true));
            debounce(() => dispatch(setIsMouseMoved(false)), 2000);
          }, 100);
        }}
        onTransitionEnd={(event: TransitionEvent<HTMLElement>) => {
          if (event.propertyName === 'rotate') {
            dispatch(setIsRotationFinished(true));
            debounce(() => dispatch(setIsRotationFinished(false)), 2000);
          }
        }}
        className='w-screen h-dvh fixed inset-0 z-40 bg-white opacity-0 pointer-events-none'
      >
        <Toaster toasterId='post-viewer' />

        <PostViewerToolbar {...post} />
        <PostViewerContainer {...post} />
        <PostViewerControlBar />
      </div>

      <div
        data-viewer-measurement
        className='prose fixed z-1000 w-full left-[100%] top-0'
        aria-hidden='true'
      >
        {result}
      </div>
    </>
  );
}
