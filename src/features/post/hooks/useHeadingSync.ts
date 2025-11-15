'use client';

import { findHeadingByScroll } from '@/features/post/domain/lib/heading';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useThrottle from '@/hooks/useThrottle';
import { setCurrentHeading } from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { scrollIntoElement } from '@/lib/scroll';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function useHeadingSync() {
  const dispatch = useDispatch<AppDispatch>();
  const throttle = useThrottle();
  const { page, isViewerMode } = usePostViewer();

  useEffect(() => {
    if (isViewerMode) {
      if (!page?.heading) return;
      const postContent = document.querySelector('[data-post-content]');
      const element = postContent?.querySelector(`#${page.heading.id}`);
      if (!element) return;
      scrollIntoElement(element);
    } else {
      const updateHeading = () =>
        throttle(() => {
          const heading = findHeadingByScroll();
          if (heading) {
            dispatch(setCurrentHeading(heading));
          }
        }, 100);

      document.addEventListener('scroll', updateHeading);
      return () => document.removeEventListener('scroll', updateHeading);
    }
  }, [dispatch, isViewerMode, page?.heading, throttle]);
}
