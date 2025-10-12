'use client';

import { setIsContentVisible } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function useContentTracker(
  postContentRef: RefObject<HTMLElement | null>
) {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!postContentRef.current) return;

    const proseElement = postContentRef.current;
    const proseObserver = new IntersectionObserver(
      entries => {
        if (isInitialMount.current) {
          isInitialMount.current = false;
          return;
        }
        dispatch(setIsContentVisible(entries[0].isIntersecting));
      },
      {
        rootMargin: '10% 0px -90% 0px',
      }
    );
    proseObserver.observe(proseElement);
    return () => proseObserver.disconnect();
  }, [dispatch, postContentRef]);
}
