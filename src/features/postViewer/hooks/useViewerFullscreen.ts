'use client';

import { setIsViewerMode } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useViewerFullscreen() {
  const dispatch = useDispatch<AppDispatch>();
  const isViewerMode = useSelector((state: RootState) => {
    return state.postViewer.isViewerMode;
  });

  useEffect(() => {
    const viewer = document.querySelector('[data-post-viewer]') as HTMLElement;
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
}
