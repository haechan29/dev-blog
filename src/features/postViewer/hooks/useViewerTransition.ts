'use client';

import { supportsFullscreen } from '@/lib/browser';
import { RefObject, useLayoutEffect } from 'react';

const CLASS_LIST_VIEWER_TRANSITION = [
  'transition-transform|opacity',
  'duration-300',
  'ease-in-out',
  'translate-x-[100dvw]',
];

export default function useViewerTransition(
  postViewerRef: RefObject<HTMLDivElement | null>
) {
  useLayoutEffect(() => {
    const postViewer = postViewerRef.current;
    if (!postViewer) return;

    if (!supportsFullscreen) {
      postViewer.classList.add(...CLASS_LIST_VIEWER_TRANSITION);
      return () => postViewer.classList.remove(...CLASS_LIST_VIEWER_TRANSITION);
    }
  }, [postViewerRef]);
}
