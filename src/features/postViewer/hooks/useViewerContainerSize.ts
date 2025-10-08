'use client';

import useFullscreenSize from '@/hooks/useFullscreenSize';
import { getCSSVariable } from '@/lib/css';
import { remToPx } from '@/lib/dom';
import { Size } from '@/types/size';
import { useEffect, useState } from 'react';

export default function useViewerContainerSize() {
  const [containerSize, setContainerSize] = useState<Size | null>(null);

  const fullscreenSize = useFullscreenSize();

  useEffect(() => {
    if (!fullscreenSize) return;
    const { width: fullscreenWidth, height: fullscreenHeight } = fullscreenSize;

    const containerPaddingPx = remToPx(
      parseFloat(getCSSVariable('--container-padding'))
    );
    const containerScale = parseFloat(getCSSVariable('--container-scale'));

    setContainerSize({
      width: (fullscreenWidth - containerPaddingPx * 2) / containerScale,
      height: (fullscreenHeight - containerPaddingPx * 2) / containerScale,
    });
  }, [fullscreenSize]);

  return containerSize;
}
