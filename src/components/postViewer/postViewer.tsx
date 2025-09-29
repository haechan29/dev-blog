'use client';

import PostViewerContent from '@/components/postViewer/postViewerContent';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { useViewerNavigation } from '@/features/postViewer/hooks/useViewerNavigation';
import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import {
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

  useViewerNavigation(postViewerContentRef);

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
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, isViewerMode]);

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
