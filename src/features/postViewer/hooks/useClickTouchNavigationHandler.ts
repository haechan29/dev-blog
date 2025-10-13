'use client';

import useDebounce from '@/hooks/useDebounce';
import { canTouch, supportsFullscreen } from '@/lib/browser';
import { createRipple } from '@/lib/dom';
import { nextPage, previousPage } from '@/lib/redux/postPositionSlice';
import { setIsTouched } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { MouseEvent, TouchEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useClickTouchNavigationHandler() {
  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();

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
      if (typeof document === 'undefined' || !currentTarget.parentElement)
        return;

      const rippleContainer = supportsFullscreen
        ? currentTarget.parentElement
        : document.body;
      createRipple(clientX, clientY, rippleContainer);

      const { width, height } = currentTarget.getBoundingClientRect();
      const [isLeftSideClicked, isRightSideClicked] = supportsFullscreen
        ? [clientX < width / 2, clientX > width / 2]
        : [clientY < height / 2, clientY > height / 2];

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
      if (canTouch) return;

      handleNavigation(event);
    },
    [handleNavigation]
  );

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      dispatch(setIsTouched(true));
      debounce(() => dispatch(setIsTouched(false)), 2000);

      handleNavigation({
        clientX: event.changedTouches[0].clientX,
        clientY: event.changedTouches[0].clientY,
        currentTarget: event.currentTarget,
      });
    },
    [debounce, dispatch, handleNavigation]
  );

  return { onClick, onTouchEnd } as const;
}
