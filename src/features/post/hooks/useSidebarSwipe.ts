'use client';

import { setIsVisible } from '@/lib/redux/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function useSidebarSwipe() {
  const dispatch = useDispatch<AppDispatch>();

  const startRef = useRef<[number, number] | null>(null);
  const scrollDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const sidebar = e.currentTarget;
    startRef.current = [e.touches[0].clientX, e.touches[0].clientY];
    sidebar.style.transition = 'none';
    scrollDirectionRef.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const sidebar = e.currentTarget;

    const start = startRef.current;
    const scrollDirection = scrollDirectionRef.current;
    if (start === null) return;

    const [currentX, currentY] = [e.touches[0].clientX, e.touches[0].clientY];

    if (!scrollDirection) {
      const deltaX = currentX - start[0];
      const deltaY = currentY - start[1];
      scrollDirectionRef.current =
        Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      e.preventDefault();
      document.body.style.overflow = 'hidden';
    }

    if (scrollDirection === 'horizontal') {
      const translateX = Math.min(currentX - start[0], 0);
      sidebar.style.transform = `translateX(${translateX}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const sidebar = e.currentTarget;

      const start = startRef.current;
      if (start === null) return;

      if (scrollDirectionRef.current === 'horizontal') {
        const currentX = e.changedTouches[0].clientX;
        const translateX = Math.min(currentX - start[0], 0);
        const threshold = -sidebar.getBoundingClientRect().width * 0.3;

        if (translateX > threshold) {
          dispatch(setIsVisible(true));
        } else {
          dispatch(setIsVisible(false));
        }
      }

      sidebar.style.transition = '';
      sidebar.style.transform = '';
      document.body.style.overflow = '';
      startRef.current = null;
      scrollDirectionRef.current = null;
    },
    [dispatch]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  } as const;
}
