'use client';

import Heading from '@/features/post/domain/model/heading';
import useThrottle from '@/hooks/useThrottle';
import { useCallback, useEffect, useState } from 'react';

export default function useHeadingTracker({
  headings,
}: {
  headings: Heading[];
}) {
  const throttle = useThrottle();
  const [heading, setHeading] = useState<Heading | null>(null);
  const [positionMap, setPositionMap] = useState<Map<Heading, number> | null>(
    null
  );

  useEffect(() => {
    const postContent = document.querySelector('[data-post-content]');
    if (typeof window === 'undefined' || !postContent) return;

    const positionMap = new Map<Heading, number>();
    headings.forEach(heading => {
      const headingElement = postContent.querySelector<HTMLElement>(
        `#${heading.id}`
      );
      if (headingElement) {
        positionMap.set(heading, headingElement.offsetTop);
      }
    });

    setPositionMap(positionMap);
  }, [headings]);

  const getCurrentHeading = useCallback(() => {
    if (typeof window === 'undefined' || !positionMap) return null;

    const vh = window.innerHeight;
    const threshold = 0.1 * vh;

    const headingElementsInVisibleArea = [...positionMap]
      .filter(([, position]) => Math.abs(position - window.scrollY) < threshold)
      .map(([heading]) => heading);

    if (headingElementsInVisibleArea.length > 0) {
      return headingElementsInVisibleArea[0];
    }

    const allHeadingElementsAbove = [...positionMap]
      .filter(([, position]) => position < window.scrollY - threshold)
      .map(([heading]) => heading);

    if (allHeadingElementsAbove.length > 0) {
      return allHeadingElementsAbove[allHeadingElementsAbove.length - 1];
    }

    return null;
  }, [positionMap]);

  useEffect(() => {
    const updateHeading = () =>
      throttle(() => {
        const currentHeading = getCurrentHeading();
        setHeading(currentHeading);
      }, 100);

    document.addEventListener('scroll', updateHeading);
    return () => document.removeEventListener('scroll', updateHeading);
  }, [getCurrentHeading, throttle]);

  return { heading } as const;
}
