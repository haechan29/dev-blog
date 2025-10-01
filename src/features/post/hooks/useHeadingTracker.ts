'use client';

import Heading from '@/features/post/domain/model/heading';
import useThrottle from '@/hooks/useThrottle';
import { setCurrentHeading } from '@/lib/redux/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function useHeadingTracker({
  headings,
}: {
  headings: Heading[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const throttle = useThrottle();

  const getTargetHeading = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const vh = window.innerHeight;
    const threshold = 0.1 * vh;

    const targetElementsInVisibleArea = headings.filter(heading => {
      const element = document.getElementById(heading.id);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return Math.abs(rect.top) <= threshold;
    });

    if (targetElementsInVisibleArea.length > 0) {
      return targetElementsInVisibleArea[0];
    }

    const allTargetElementsAbove = headings.filter(heading => {
      const element = document.getElementById(heading.id);
      return element && element.getBoundingClientRect().top <= 0.1 * vh;
    });

    if (allTargetElementsAbove.length >= headings.length) return null;

    if (allTargetElementsAbove.length > 0) {
      return allTargetElementsAbove[allTargetElementsAbove.length - 1];
    }

    return null;
  }, [headings]);

  const updateHeadings = useCallback(() => {
    throttle(() => {
      const targetHeading = getTargetHeading();
      dispatch(setCurrentHeading(targetHeading));
    }, 1000);
  }, [dispatch, getTargetHeading, throttle]);

  useEffect(() => {
    updateHeadings();
    document.addEventListener('scroll', updateHeadings);

    return () => {
      document.removeEventListener('scroll', updateHeadings);
    };
  }, [updateHeadings]);
}
