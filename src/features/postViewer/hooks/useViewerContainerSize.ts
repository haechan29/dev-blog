'use client';

import { supportsFullscreen } from '@/lib/browser';
import { getCSSVariable } from '@/lib/css';
import { remToPx } from '@/lib/dom';
import { Size } from '@/types/size';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useViewerContainerSize() {
  const [fullscreenSize, setFullscreenSize] = useState<Size | null>(null);

  const containerSize = useMemo(() => {
    if (!fullscreenSize) return;
    const { width: fullscreenWidth, height: fullscreenHeight } = fullscreenSize;

    const containerPaddingPx = remToPx(
      parseFloat(getCSSVariable('--container-padding'))
    );
    const containerScale = parseFloat(getCSSVariable('--container-scale'));

    return {
      width: (fullscreenWidth - containerPaddingPx * 2) / containerScale,
      height: (fullscreenHeight - containerPaddingPx * 2) / containerScale,
    };
  }, [fullscreenSize]);

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

  return containerSize;
}
