'use client';

import { supportsFullscreen } from '@/lib/browser';
import { RefObject, useCallback, useRef } from 'react';

const CLASS_LIST_VISIBILITY = ['opacity-0', 'pointer-events-none'];
const CLASS_LIST_FULLSCREEN = ['rotate-90', 'origin-top-left'];

export default function useFullscreen(
  elementRef: RefObject<HTMLElement | null>
) {
  const prevWidthRef = useRef<string | null>(null);
  const prevHeightRef = useRef<string | null>(null);

  const expandToFullscreenSize = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    prevWidthRef.current = element.style.width;
    prevHeightRef.current = element.style.height;
    element.style.width = '100dvh';
    element.style.height = '100dvw';
  }, [elementRef]);

  const shrinkToElementSize = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const prevWidth = prevWidthRef.current;
    const prevHeight = prevHeightRef.current;
    if (prevWidth !== null) element.style.width = prevWidth;
    if (prevHeight !== null) element.style.height = prevHeight;
    prevWidthRef.current = null;
    prevHeightRef.current = null;
  }, [elementRef]);

  const requestFullscreen = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    element.classList.remove(...CLASS_LIST_VISIBILITY);

    if (supportsFullscreen) {
      element.requestFullscreen();
    } else {
      expandToFullscreenSize();
      element.classList.add(...CLASS_LIST_FULLSCREEN);
    }
  }, [elementRef, expandToFullscreenSize]);

  const exitFullscreen = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    element.classList.add(...CLASS_LIST_VISIBILITY);

    if (supportsFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } else {
      shrinkToElementSize();
      element.classList.remove(...CLASS_LIST_FULLSCREEN);
    }
  }, [elementRef, shrinkToElementSize]);

  return { requestFullscreen, exitFullscreen } as const;
}
