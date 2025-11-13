'use client';

import { useEffect, useRef } from 'react';

const SCROLL_THRESHOLD = 10;

export default function useScrollLock({
  isLocked,
  allowedSelectors = [],
}: {
  isLocked: boolean;
  allowedSelectors?: string[];
}) {
  const firstTouchRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    const allowedElements: HTMLElement[] = allowedSelectors.flatMap(selector =>
      Array.from(document.querySelectorAll(selector))
    );

    const onTouchStart = (e: TouchEvent) => {
      if (firstTouchRef.current) return;
      const { clientX, clientY } = e.touches[0];
      firstTouchRef.current = [clientX, clientY];
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!firstTouchRef.current) return;
      const [startX, startY] = firstTouchRef.current;

      const { clientX, clientY } = e.touches[0];
      const deltaX = Math.abs(clientX - startX);
      const deltaY = Math.abs(clientY - startY);
      if (deltaX < SCROLL_THRESHOLD && deltaY < SCROLL_THRESHOLD) return;
      const scrollDirection = deltaX > deltaY ? 'horizontal' : 'vertical';

      const target = e.target as HTMLElement;
      const allowedElement = allowedSelectors
        .map(selector => target.closest(selector))
        .find(Boolean) as HTMLElement | null;

      if (
        (!allowedElement ||
          allowedElement.scrollHeight <= allowedElement.clientHeight) &&
        scrollDirection === 'vertical'
      ) {
        e.preventDefault();
      }
    };
    const option: AddEventListenerOptions = {
      passive: false,
    };

    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.addEventListener('touchstart', onTouchStart, option);
      document.addEventListener('touchmove', onTouchMove, option);
      allowedElements.forEach(element => {
        element.style.overscrollBehavior = 'contain';
      });
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('touchstart', onTouchStart, option);
      document.removeEventListener('touchmove', onTouchMove, option);
      allowedElements.forEach(
        element => (element.style.overscrollBehavior = 'auto')
      );
    };
  }, [allowedSelectors, isLocked]);
}
