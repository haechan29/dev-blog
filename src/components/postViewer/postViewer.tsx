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
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewer() {
  const pageRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isViewerMode, pageIndex, totalPages } = useMemo(
    () => toProps(postViewer),
    [postViewer]
  );
  const postViewerRef = useRef<HTMLDivElement | null>(null);

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
        if (event.deltaY > 0) {
          if (pageIndex == totalPages - 1) {
            toast.success('마지막 페이지입니다.', {
              id: 'post-viewer',
              toasterId: 'post-viewer',
            });
            return;
          }
          dispatch(nextPage());
        } else if (event.deltaY < 0) {
          if (pageIndex == 0) {
            toast.success('첫 페이지입니다.', {
              id: 'post-viewer',
              toasterId: 'post-viewer',
            });
            return;
          }
          dispatch(previousPage());
        }
      }, 100);
    },
    [dispatch, pageIndex, throttle, totalPages]
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
      <PostViewerContent pageRef={pageRef} />
      <PostViewerControlBar pageRef={pageRef} />
      <Toaster toasterId='post-viewer' />
    </div>
  );
}
