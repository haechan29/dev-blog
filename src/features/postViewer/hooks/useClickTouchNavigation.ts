'use client';

import { supportsFullscreen } from '@/lib/browser';
import { nextPage, previousPage } from '@/lib/redux/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import { MouseEvent, TouchEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useClickTouchNavigation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleNavigation = useCallback(
    ({
      clientX,
      clientY,
      currentTarget,
    }: {
      clientX: number;
      clientY: number;
      currentTarget: HTMLDivElement;
    }) => {
      const { width: clientWidth, height: clientHeight } =
        currentTarget.getBoundingClientRect();

      const [isLeftSideClicked, isRightSideClicked] = supportsFullscreen
        ? [clientX < clientWidth / 2, clientX > clientWidth / 2]
        : [clientY < clientHeight / 2, clientY > clientHeight / 2];

      if (isLeftSideClicked) {
        dispatch(previousPage());
      } else if (isRightSideClicked) {
        dispatch(nextPage());
      }
    },
    [dispatch]
  );

  const onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if ('ontouchstart' in window) return; // block event handling on mobile

      handleNavigation(event);
    },
    [handleNavigation]
  );

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      handleNavigation({
        clientX: event.changedTouches[0].clientX,
        clientY: event.changedTouches[0].clientY,
        currentTarget: event.currentTarget,
      });
    },
    [handleNavigation]
  );

  return { onClick, onTouchEnd } as const;
};
