'use client';

import { setIsSwipedUp } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function useSwipeTracker(
  postContentRef: RefObject<HTMLElement | null>
) {
  const dispatch = useDispatch<AppDispatch>();
  const startYRef = useRef<number | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (startYRef.current === null) return;

      const startY = startYRef.current;
      const endY = e.changedTouches[0].clientY;
      dispatch(setIsSwipedUp(startY - endY > 50));

      startYRef.current = null;
    },
    [dispatch]
  );

  useEffect(() => {
    if (!postContentRef.current) return;

    const postContent = postContentRef.current;
    postContent.addEventListener('touchstart', onTouchStart);
    postContent.addEventListener('touchend', onTouchEnd);

    return () => {
      postContent.removeEventListener('touchstart', onTouchStart);
      postContent.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchEnd, onTouchStart, postContentRef]);
}
