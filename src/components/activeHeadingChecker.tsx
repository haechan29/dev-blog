'use client';

import { Heading } from '@/features/post/domain/model/post';
import useMediaQuery from '@/hooks/useMediaQuery';
import useThrottle from '@/hooks/useThrottle';
import { setSelectedHeading, setTitle } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function ActiveHeadingDetector({
  headings,
}: {
  headings: Heading[];
}) {
  const dispatch = useDispatch<AppDispatch>();

  const [throttle100Ms] = useThrottle(100);
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');

  const getTargetHeading = useCallback(() => {
    const targetElementsInVisibleArea = headings.filter(heading => {
      const element = document.getElementById(heading.id);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.top >= 10 && rect.top <= 20;
    });

    if (targetElementsInVisibleArea.length > 0) {
      return targetElementsInVisibleArea[0];
    }

    const allTargetElementsAbove = headings.filter(heading => {
      const element = document.getElementById(heading.id);
      return element && element.getBoundingClientRect().top < 10;
    });

    if (allTargetElementsAbove.length > 0) {
      return allTargetElementsAbove[allTargetElementsAbove.length - 1];
    }

    return null;
  }, [headings]);

  const updateHeadings = useCallback(() => {
    const targetHeading = getTargetHeading();
    if (targetHeading !== null) {
      dispatch(setSelectedHeading(targetHeading));
    }
  }, [headings, dispatch, getTargetHeading]);

  useEffect(() => {
    if (isLargerThanXl) return;

    updateHeadings();
    const throttledUpdate = () => throttle100Ms(updateHeadings);
    window.addEventListener('scroll', throttledUpdate);

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, [isLargerThanXl, updateHeadings]);

  return <></>;
}
