'use client';

import { supportsFullscreen } from '@/lib/browser';
import { getCSSVariable } from '@/lib/css';
import { remToPx } from '@/lib/dom';
import { Size } from '@/types/size';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function useViewerContainerSize() {
  const windowSizeRef = useRef<Size | null>(null);
  const [fullscreenSize, setFullscreenSize] = useState<Size | null>(null);
  const isFullscreenSizeSetRef = useRef(false);

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

  useEffect(() => {
    windowSizeRef.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  useEffect(() => {
    if (isFullscreenSizeSetRef.current) return;
    if (supportsFullscreen) {
      const handleFullscreenChange = () => {
        if (!document.fullscreenElement || !windowSizeRef.current) return;
        let retryCount = 0;
        const maxCount = 10;
        const { width, height } = windowSizeRef.current;

        const interval = setInterval(() => {
          const { innerWidth: newWidth, innerHeight: newHeight } = window;
          if (width !== newWidth || height !== newHeight) {
            setFullscreenSize({
              width: newWidth,
              height: newHeight,
            });
            isFullscreenSizeSetRef.current = true;
            clearInterval(interval);
          } else if (++retryCount >= maxCount) {
            clearInterval(interval);
          }
        }, 100);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () =>
        document.removeEventListener(
          'fullscreenchange',
          handleFullscreenChange
        );
    } else if (!supportsFullscreen) {
      // for 90° rotated layout: swap width/height since viewport dimensions are inverted
      setFullscreenSize({
        width: window.innerHeight,
        height: window.innerWidth,
      });
      isFullscreenSizeSetRef.current = true;
    }
  }, []);

  return containerSize;
}
