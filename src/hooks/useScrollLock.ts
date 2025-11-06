'use client';

import { useEffect } from 'react';

export default function useScrollLock({
  isLocked,
  allowedSelectors = [],
}: {
  isLocked: boolean;
  allowedSelectors?: string[];
}) {
  useEffect(() => {
    const allowedElements: HTMLElement[] = allowedSelectors.flatMap(selector =>
      Array.from(document.querySelectorAll(selector))
    );

    const preventDefault = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const allowedElement = allowedSelectors
        .map(selector => target.closest(selector))
        .find(Boolean) as HTMLElement | null;

      if (
        !allowedElement ||
        allowedElement.scrollHeight <= allowedElement.clientHeight
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
      document.addEventListener('touchmove', preventDefault, option);
      allowedElements.forEach(element => {
        element.style.overscrollBehavior = 'contain';
      });
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('touchmove', preventDefault, option);
      allowedElements.forEach(
        element => (element.style.overscrollBehavior = 'auto')
      );
    };
  }, [allowedSelectors, isLocked]);
}
