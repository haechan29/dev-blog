'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useThrottle from '@/hooks/useThrottle';
import { nextPage, previousPage } from '@/lib/redux/post/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function useKeyboardWheelNavigation() {
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
}
