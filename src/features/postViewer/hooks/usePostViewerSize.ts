'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getContentSize } from '@/lib/dom';
import {} from '@/lib/redux/postViewerSlice';
import { Size } from '@/types/size';
import { RefObject, useCallback, useEffect } from 'react';

export default function usePostViewerSize(
  postViewerContentRef: RefObject<HTMLDivElement | null>
) {
  const [postViewerSize, setPostViewerSize] = useLocalStorage<Size | null>(
    'post-viewer-size',
    null
  );

  const handleFullscreenChange = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!postViewerSize && document.fullscreenElement) {
      setTimeout(() => {
        const postViewerContent = postViewerContentRef.current;
        if (!postViewerContent) return;
        setPostViewerSize(getContentSize(postViewerContent));
      }, 100);
    }
  }, [postViewerContentRef, postViewerSize, setPostViewerSize]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  return postViewerSize;
}
