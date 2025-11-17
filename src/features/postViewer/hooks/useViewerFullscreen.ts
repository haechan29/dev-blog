'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import { supportsFullscreen } from '@/lib/browser';
import { setIsViewerMode } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

const CLASS_LIST_VISIBILITY = ['opacity-0', 'pointer-events-none'];
const CLASS_LIST_FULLSCREEN = ['rotate-90', 'origin-top-left'];
const CLASS_LIST_TRANSITION = [
  'transition-transform|opacity',
  'duration-300',
  'ease-in-out',
  'translate-x-[100dvw]',
];

export default function useViewerFullscreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { isViewerMode } = usePostViewer();

  const prevWidthRef = useRef<string | null>(null);
  const prevHeightRef = useRef<string | null>(null);

  const expandToFullscreenSize = useCallback(() => {
    const viewer = document.querySelector('[data-post-viewer]') as HTMLElement;
    if (!viewer) return;

    prevWidthRef.current = viewer.style.width;
    prevHeightRef.current = viewer.style.height;
    viewer.style.width = '100dvh';
    viewer.style.height = '100dvw';
  }, []);

  const shrinkToElementSize = useCallback(() => {
    const viewer = document.querySelector('[data-post-viewer]') as HTMLElement;
    if (!viewer) return;

    const prevWidth = prevWidthRef.current;
    const prevHeight = prevHeightRef.current;
    if (prevWidth !== null) viewer.style.width = prevWidth;
    if (prevHeight !== null) viewer.style.height = prevHeight;
    prevWidthRef.current = null;
    prevHeightRef.current = null;
  }, []);

  const requestFullscreen = useCallback(() => {
    const viewer = document.querySelector('[data-post-viewer]') as HTMLElement;
    if (!viewer) return;

    viewer.classList.remove(...CLASS_LIST_VISIBILITY);

    if (supportsFullscreen) {
      viewer.requestFullscreen();
    } else {
      expandToFullscreenSize();
      viewer.classList.add(...CLASS_LIST_FULLSCREEN);
    }
  }, [expandToFullscreenSize]);

  const exitFullscreen = useCallback(() => {
    const viewer = document.querySelector('[data-post-viewer]') as HTMLElement;
    if (!viewer) return;

    viewer.classList.add(...CLASS_LIST_VISIBILITY);

    if (supportsFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } else {
      shrinkToElementSize();
      viewer.classList.remove(...CLASS_LIST_FULLSCREEN);
    }
  }, [shrinkToElementSize]);

  useLayoutEffect(() => {
    const viewer = document.querySelector('[data-post-viewer]') as HTMLElement;
    if (!viewer) return;

    if (!supportsFullscreen) {
      viewer.classList.add(...CLASS_LIST_TRANSITION);
      return () => viewer.classList.remove(...CLASS_LIST_TRANSITION);
    }
  }, []);

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
}
