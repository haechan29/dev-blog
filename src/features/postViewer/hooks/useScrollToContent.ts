'use client';

import usePostReader from '@/features/post/hooks/usePostReader';
import { scrollIntoElement } from '@/lib/scroll';
import { RefObject, useEffect } from 'react';

export default function useScrollToContent(
  contentsRef: RefObject<Map<string, HTMLElement>>
) {
  const {
    postReader: { currentHeading },
  } = usePostReader();

  useEffect(() => {
    if (!currentHeading) return;

    const content = contentsRef.current.get(currentHeading.id);
    if (!content) return;

    const scrollToContent = () => {
      scrollIntoElement(content, {
        behavior: 'smooth',
        block: 'nearest',
      });
    };
    content.addEventListener('transitionend', scrollToContent);
    return () => content.removeEventListener('transitionend', scrollToContent);
  }, [contentsRef, currentHeading]);
}
