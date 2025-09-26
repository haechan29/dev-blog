'use client';

import PostViewerContent from '@/components/postViewer/postViewerContent';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import {
  nextPage,
  previousPage,
  setIsControlBarVisible,
  setIsViewerMode,
} from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewer() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isViewerMode } = useMemo(() => toProps(postViewer), [postViewer]);
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  const postViewerContentRef = useRef<HTMLDivElement | null>(null);

  const debounce = useDebounce();
  const throttle = useThrottle();

  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement && isViewerMode) {
      dispatch(setIsViewerMode(false));
    }
  }, [dispatch, isViewerMode]);

  const handleMouseMove = useCallback(() => {
    throttle(() => {
      dispatch(setIsControlBarVisible(true));
      debounce(() => dispatch(setIsControlBarVisible(false)), 3000);
    }, 100);
  }, [debounce, dispatch, throttle]);

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      throttle(() => {
        const [isScrolledUp, isScrolledDown] = [
          event.deltaY > 0,
          event.deltaY < 0,
        ];
        if (isScrolledUp) {
          dispatch(nextPage());
        } else if (isScrolledDown) {
          dispatch(previousPage());
        }
      }, 100);
    },
    [dispatch, throttle]
  );

  const handleNavigation = useCallback(
    (clientX: number, clientWidth: number) => {
      const [isLeftSideClicked, isRightSideClicked] = [
        clientX < clientWidth / 2,
        clientX > clientWidth / 2,
      ];

      if (isLeftSideClicked) {
        dispatch(previousPage());
      } else if (isRightSideClicked) {
        dispatch(nextPage());
      }
    },
    [dispatch]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if ('ontouchstart' in window) return; // block event handling on mobile

      const { clientX } = event;
      const { clientWidth } = event.currentTarget;

      handleNavigation(clientX, clientWidth);
    },
    [handleNavigation]
  );

  const handleTouch = useCallback(
    (event: React.TouchEvent) => {
      const { clientX } = event.changedTouches[0];
      const { clientWidth } = event.currentTarget;

      handleNavigation(clientX, clientWidth);
    },
    [handleNavigation]
  );

  useEffect(() => {
    if (typeof document === 'undefined' || !postViewerRef.current) return;

    if (isViewerMode) {
      postViewerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isViewerMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  useEffect(() => {
    if (isViewerMode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('wheel', handleScroll);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('wheel', handleScroll);
    };
  }, [handleMouseMove, handleScroll, isViewerMode]);

  return (
    <div
      ref={postViewerRef}
      className={clsx('bg-white flex flex-col', !isViewerMode && 'hidden')}
    >
      <PostViewerContent
        postViewerContentRef={postViewerContentRef}
        onContentClick={handleClick}
        onContentTouch={handleTouch}
      />
      <PostViewerControlBar postViewerContentRef={postViewerContentRef} />
      <Toaster toasterId='post-viewer' />
    </div>
  );
}
