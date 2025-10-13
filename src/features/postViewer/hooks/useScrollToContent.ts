'use client';

import useViewerToolbar from '@/features/postViewer/hooks/useViewerToolbar';
import { scrollToElement } from '@/lib/scroll';
import { RefObject, useEffect } from 'react';

export default function useScrollToContent(
  contentsRef: RefObject<Map<string, HTMLElement>>
) {
  const { currentHeading } = useViewerToolbar();

  useEffect(() => {
    if (!currentHeading) return;

    const content = contentsRef.current.get(currentHeading.id);
    if (!content) return;

    const scrollToContent = () =>
      scrollToElement(content, {
        behavior: 'smooth',
        block: 'nearest',
      });
    content.addEventListener('transitionend', scrollToContent);
    return () => content.removeEventListener('transitionend', scrollToContent);
  }, [contentsRef, currentHeading]);
}
