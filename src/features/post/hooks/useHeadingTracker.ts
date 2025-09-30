'use client';

import { Heading } from '@/features/post/domain/model/post';
import useThrottle from '@/hooks/useThrottle';
import { setSelectedHeading } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function useHeadingTracker({
  headings,
}: {
  headings: Heading[];
}) {
  const dispatch = useDispatch<AppDispatch>();

  const filteredHeadings = useMemo(
    () => headings.filter(heading => heading.level === 1),
    [headings]
  );

  const throttle = useThrottle();

  const getTargetHeading = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const vh = window.innerHeight;

    const targetElementsInVisibleArea = filteredHeadings.filter(heading => {
      const element = document.getElementById(heading.id);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.top >= -0.1 * vh && rect.top <= 0.1 * vh;
    });

    if (targetElementsInVisibleArea.length > 0) {
      return targetElementsInVisibleArea[0];
    }

    const allTargetElementsAbove = filteredHeadings.filter(heading => {
      const element = document.getElementById(heading.id);
      return element && element.getBoundingClientRect().top <= 0.1 * vh;
    });

    if (allTargetElementsAbove.length > 0) {
      return allTargetElementsAbove[allTargetElementsAbove.length - 1];
    }

    return null;
  }, [filteredHeadings]);

  const updateHeadings = useCallback(() => {
    throttle(() => {
      const targetHeading = getTargetHeading();
      if (!targetHeading) return;

      dispatch(setSelectedHeading(targetHeading));
    }, 1000);
  }, [dispatch, getTargetHeading, throttle]);

  useEffect(() => {
    updateHeadings();
    window.addEventListener('scroll', updateHeadings);

    return () => {
      window.removeEventListener('scroll', updateHeadings);
    };
  }, [updateHeadings]);
}
