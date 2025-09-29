'use client';

import { toProps } from '@/features/postViewer/domain/model/postViewer';
import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { RefObject, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFullscreen = (
  postViewerRef: RefObject<HTMLDivElement | null>
) => {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isViewerMode } = useMemo(() => toProps(postViewer), [postViewer]);

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
