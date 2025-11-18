'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import useDebounce from '@/hooks/useDebounce';
import useScrollLock from '@/hooks/useScrollLock';
import useThrottle from '@/hooks/useThrottle';
import { canTouch, supportsFullscreen } from '@/lib/browser';
import { cv } from '@/lib/cv';
import { createRipple } from '@/lib/dom';
import {
  nextPage,
  previousPage,
  setIsMouseMoved,
  setIsRotationFinished,
  setIsTouched,
  setIsViewerMode,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { MouseEvent, TransitionEvent, useCallback, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewer({ post }: { post: PostProps }) {
  const dispatch = useDispatch<AppDispatch>();
  const isViewerMode = useSelector((state: RootState) => {
    return state.postViewer.isViewerMode;
  });
  const throttle = useThrottle();
  const debounce = useDebounce();

  const handleNavigation = useCallback(
    ({
      clientX,
      clientY,
      currentTarget,
    }: {
      clientX: number;
      clientY: number;
      currentTarget: HTMLDivElement;
    }) => {
      if (typeof document === 'undefined') return;

      const { width, height } = currentTarget.getBoundingClientRect();
      const [isLeftSideClicked, isRightSideClicked] = supportsFullscreen
        ? [clientX < width / 2, clientX > width / 2]
        : [clientY < height / 2, clientY > height / 2];

      if (isLeftSideClicked) {
        dispatch(previousPage());
      } else if (isRightSideClicked) {
        dispatch(nextPage());
      }
    },
    [dispatch]
  );

  useScrollLock({ isLocked: isViewerMode });

  useEffect(() => {
    const viewer = document.querySelector('[data-viewer]') as HTMLElement;
    if (!viewer) return;

    if (isViewerMode) {
      viewer.dataset.isFullscreen = `${true}`;
      if (viewer.requestFullscreen) {
        viewer.requestFullscreen();
      } else {
        viewer.dataset.supportsFullscreen = `${false}`;
      }
    } else {
      viewer.dataset.isFullscreen = `${false}`;
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  }, [isViewerMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isViewerMode) {
        dispatch(setIsViewerMode(false));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [dispatch, isViewerMode]);

  return (
    <div
      data-viewer
      data-supports-fullscreen='false'
      data-is-fullscreen='false'
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        if (canTouch) {
          createRipple({
            ...event,
            rippleColor: 'rgba(0,0,0,0.1)',
          });
          dispatch(setIsTouched(true));
          debounce(() => dispatch(setIsTouched(false)), 2000);
        }
        handleNavigation(event);
      }}
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
      className={clsx(
        'fixed inset-0 z-40 p-[var(--container-padding)] bg-white',
        cv(
          'data-[supports-fullscreen=false]',
          'transition-transform|opacity duration-300 ease-in-out translate-x-[100dvw]'
        ),
        cv('data-[is-fullscreen=false]', 'opacity-0 pointer-events-none'),
        cv(
          'data-[supports-fullscreen=false]:data-[is-fullscreen=true]',
          'w-dvh h-dvw rotate-90 origin-top-left'
        )
      )}
    >
      <Toaster toasterId='viewer' />

      <PostViewerToolbar {...post} />
      <PostViewerContainer {...post} />
      <PostViewerControlBar />
    </div>
  );
}
