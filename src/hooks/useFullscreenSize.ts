'use client';

import { supportsFullscreen } from '@/lib/browser';
import { Size } from '@/types/size';
import { useCallback, useEffect, useState } from 'react';

export default function useFullscreenSize() {
  const [fullscreenSize, setFullscreenSize] = useState<Size | null>(null);

  const handleFullscreenChange = useCallback(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined')
      return;

    if (!fullscreenSize && document.fullscreenElement) {
      setFullscreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, [fullscreenSize]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined')
      return;

    if (supportsFullscreen) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () =>
        document.removeEventListener(
          'fullscreenchange',
          handleFullscreenChange
        );
    } else {
      if (!fullscreenSize) {
        // for 90° rotated layout: swap width/height since viewport dimensions are inverted
        setFullscreenSize({
          width: window.innerHeight,
          height: window.innerWidth,
        });
      }
    }
  }, [fullscreenSize, handleFullscreenChange]);

  return fullscreenSize;
}
