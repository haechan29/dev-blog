'use client';

import { HeadingItemProps } from '@/features/post/ui/postToolbarProps';
import useMediaQuery from '@/hooks/useMediaQuery';
import useThrottle from '@/hooks/useThrottle';
import { setHeadings, setIsContentVisible } from '@/lib/redux/postToolbarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostContentSectionClient() {
  const headings = useSelector(
    (state: RootState) => state.postToolbar.headings
  );
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
    const currentSelected =
      headings.find(heading => heading.isSelected) ?? null;
    if (targetHeading === currentSelected) return;
    const newHeadings: HeadingItemProps[] = headings.map(heading => ({
      ...heading,
      isSelected: heading === targetHeading,
    }));
    dispatch(setHeadings(newHeadings));
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

  useEffect(() => {
    const proseElement = document.querySelector('.prose');
    if (!proseElement) return;

    const proseObserver = new IntersectionObserver(
      entries => dispatch(setIsContentVisible(entries[0].isIntersecting)),
      {
        rootMargin: '-20px 0px -100% 0px',
      }
    );
    proseObserver.observe(proseElement);
    return () => proseObserver.disconnect();
  }, []);

  return <></>;
}
