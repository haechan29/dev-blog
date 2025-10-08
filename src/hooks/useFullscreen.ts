'use client';

import { supportsFullscreen } from '@/lib/browser';
import { RefObject, useCallback, useRef } from 'react';

export default function useFullscreen(
  elementRef: RefObject<HTMLElement | null>
) {
  const prevWidthRef = useRef<string | null>(null);
  const prevHeightRef = useRef<string | null>(null);

  const requestFullscreen = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    if (supportsFullscreen) {
      element.requestFullscreen();
    } else {
      prevWidthRef.current = element.style.width;
      prevHeightRef.current = element.style.height;
      element.style.width = '100dvh';
      element.style.height = '100dvw';
      element.classList.add(
        'fixed',
        'inset-0',
        'overflow-auto',
        'rotate-90',
        'origin-top-left',
        'translate-x-[100dvw]'
      );
    }
  }, [elementRef]);

  const exitFullscreen = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    if (supportsFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } else {
      const prevWidth = prevWidthRef.current;
      const prevHeight = prevHeightRef.current;
      if (prevWidth !== null) element.style.width = prevWidth;
      if (prevHeight !== null) element.style.height = prevHeight;

      element.classList.remove(
        'fixed',
        'inset-0',
        'overflow-auto',
        'rotate-90',
        'origin-top-left',
        'translate-x-[100dvw]'
      );

      prevWidthRef.current = null;
      prevHeightRef.current = null;
    }
  }, [elementRef]);

  return { requestFullscreen, exitFullscreen } as const;
}
