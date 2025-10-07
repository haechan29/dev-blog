'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useFullscreenSize from '@/hooks/useFullscreenSize';
import { remToPx } from '@/lib/dom';
import { Size } from '@/types/size';
import { useEffect, useState } from 'react';

export default function usePostViewerSize() {
  const [postViewerSize, setPostViewerSize] = useState<Size | null>(null);

  const fullscreenSize = useFullscreenSize();
  const { fullscreenScale, paddingInRem } = usePostViewer();

  useEffect(() => {
    if (!fullscreenSize) return;

    const { width, height } = fullscreenSize;
    const { top, right, bottom, left } = paddingInRem;
    setPostViewerSize({
      width: (width - remToPx(right + left)) / fullscreenScale,
      height: (height - remToPx(top + bottom)) / fullscreenScale,
    });
  }, [fullscreenScale, fullscreenSize, paddingInRem]);

  return postViewerSize;
}
