'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useFullscreenSize from '@/hooks/useFullscreenSize';
import { remToPx } from '@/lib/dom';
import { Size } from '@/types/size';
import { useEffect, useState } from 'react';

export default function useViewerContainerSize() {
  const [containerSize, setContainerSize] = useState<Size | null>(null);

  const fullscreenSize = useFullscreenSize();
  const { fullscreenScale, paddingInRem } = usePostViewer();

  useEffect(() => {
    if (!fullscreenSize) return;

    const { width: fullscreenWidth, height: fullscreenHeight } = fullscreenSize;
    const { top, right, bottom, left } = paddingInRem;
    setContainerSize({
      width: (fullscreenWidth - remToPx(right + left)) / fullscreenScale,
      height: (fullscreenHeight - remToPx(top + bottom)) / fullscreenScale,
    });
  }, [fullscreenScale, fullscreenSize, paddingInRem]);

  return containerSize;
}
