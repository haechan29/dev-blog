'use client';

import { getToolbarHeightPx } from '@/features/post/domain/lib/toolbarHeight';
import Heading from '@/features/post/domain/types/heading';
import useThrottle from '@/hooks/useThrottle';
import { useEffect, useState } from 'react';

const THROTTLE_MS = 100;

function findActiveHeadingId(headings: Heading[]): string | null {
  if (headings.length === 0) return null;

  const vh = window.innerHeight;
  const threshold = 0.1 * vh;
  const scrollY = window.scrollY;
  const contentTop = scrollY + getToolbarHeightPx();

  const idAndTops = headings
    .map(h => {
      const el = document.getElementById(h.id);
      return el
        ? ({ id: h.id, top: el.getBoundingClientRect().top + scrollY } as const)
        : null;
    })
    .filter((x): x is { id: string; top: number } => x !== null);

  if (idAndTops.length === 0) return null;

  const inView = idAndTops.filter(
    ({ top }) => Math.abs(top - contentTop) < threshold
  );
  if (inView.length > 0) return inView[0].id;

  const above = idAndTops.filter(({ top }) => top < contentTop - threshold);
  if (above.length > 0) return above[above.length - 1].id;

  return null;
}

export default function useActiveHeading(headings: Heading[]): string | null {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const throttle = useThrottle();

  useEffect(() => {
    const updateHeading = () => {
      throttle(() => {
        const id = findActiveHeadingId(headings);
        setActiveHeadingId(id);
      }, THROTTLE_MS);
    };

    updateHeading();
    document.addEventListener('scroll', updateHeading);
    return () => document.removeEventListener('scroll', updateHeading);
  }, [headings, throttle]);

  return activeHeadingId;
}
