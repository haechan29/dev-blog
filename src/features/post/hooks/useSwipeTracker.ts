'use client';

import { setIsSwipedUp } from '@/lib/redux/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function useSwipeTracker() {
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
    const proseElement = document.querySelector<HTMLElement>('.post-content');
    if (!proseElement) return;

    proseElement.addEventListener('touchstart', onTouchStart);
    proseElement.addEventListener('touchend', onTouchEnd);
    return () => {
      proseElement.removeEventListener('touchstart', onTouchStart);
      proseElement.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchEnd, onTouchStart]);
}
