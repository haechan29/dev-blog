'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useFullscreen = (
  postViewerRef: RefObject<HTMLDivElement | null>
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isViewerMode, pageNumber } = usePostViewer();

  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement && isViewerMode) {
      dispatch(setIsViewerMode(false));
    }
  }, [dispatch, isViewerMode]);

  useEffect(() => {
    if (typeof document === 'undefined' || !postViewerRef.current) return;

    if (isViewerMode) {
      postViewerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isViewerMode, postViewerRef]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);
};
