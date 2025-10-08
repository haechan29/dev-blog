'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useFullscreen from '@/hooks/useFullscreen';
import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useViewerFullscreen = (
  postViewerRef: RefObject<HTMLDivElement | null>
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isViewerMode } = usePostViewer();
  const { requestFullscreen, exitFullscreen } = useFullscreen(postViewerRef);

  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement && isViewerMode) {
      dispatch(setIsViewerMode(false));
    }
  }, [dispatch, isViewerMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isViewerMode) {
      requestFullscreen();
    } else {
      exitFullscreen();
    }
  }, [requestFullscreen, exitFullscreen, isViewerMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);
};
