'use client';

import useDebounce from '@/hooks/useDebounce';
import { canTouch, supportsFullscreen } from '@/lib/browser';
import { createRipple } from '@/lib/dom';
import {
  nextPage,
  previousPage,
  setIsTouched,
} from '@/lib/redux/post/postViewerSlice';
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
      if (typeof document === 'undefined') return;

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
      const touch = event.changedTouches[0];
      createRipple({
        clientX: touch.clientX,
        clientY: touch.clientY,
        currentTarget: event.currentTarget,
        rippleColor: 'rgba(0,0,0,0.1)',
      });

      handleNavigation({
        clientX: touch.clientX,
        clientY: touch.clientY,
        currentTarget: event.currentTarget,
      });

      dispatch(setIsTouched(true));
      debounce(() => dispatch(setIsTouched(false)), 2000);
    },
    [debounce, dispatch, handleNavigation]
  );

  return { onClick, onTouchEnd } as const;
}
