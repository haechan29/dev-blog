'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useThrottle from '@/hooks/useThrottle';
import { nextPage, previousPage } from '@/lib/redux/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import { RefObject, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useViewerNavigation = (
  containerRef: RefObject<HTMLDivElement | null>
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isViewerMode } = usePostViewer();

  const throttle = useThrottle();

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      throttle(() => {
        const [isScrolledUp, isScrolledDown] = [
          event.deltaY > 0,
          event.deltaY < 0,
        ];
        if (isScrolledUp) {
          dispatch(nextPage());
        } else if (isScrolledDown) {
          dispatch(previousPage());
        }
      }, 100);
    },
    [dispatch, throttle]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        // don't handle keydown on input and text area
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        dispatch(previousPage());
      } else if (
        event.key === 'ArrowRight' ||
        event.key.toLowerCase() === 'd'
      ) {
        dispatch(nextPage());
      }
    },
    [dispatch]
  );

  const handleNavigation = useCallback(
    ({ clientX }: { clientX: number }) => {
      const container = containerRef.current;
      if (!container) return null;

      const clientWidth = container.getBoundingClientRect().width;
      const [isLeftSideClicked, isRightSideClicked] = [
        clientX < clientWidth / 2,
        clientX > clientWidth / 2,
      ];

      if (isLeftSideClicked) {
        dispatch(previousPage());
      } else if (isRightSideClicked) {
        dispatch(nextPage());
      }
    },
    [containerRef, dispatch]
  );

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if ('ontouchstart' in window) return; // block event handling on mobile

      handleNavigation(event);
    },
    [handleNavigation]
  );

  const handleTouch = useCallback(
    (event: TouchEvent) => {
      handleNavigation(event.changedTouches[0]);
    },
    [handleNavigation]
  );

  useEffect(() => {
    if (isViewerMode) {
      document.addEventListener('wheel', handleScroll);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, handleScroll, isViewerMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isViewerMode) {
      container.addEventListener('click', handleClick);
      container.addEventListener('touchend', handleTouch);
    }
    return () => {
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchend', handleTouch);
    };
  }, [containerRef, isViewerMode, handleClick, handleTouch]);
};
