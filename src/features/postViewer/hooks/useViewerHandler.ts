'use client';

import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import { canTouch } from '@/lib/browser';
import {
  setIsMouseMoved,
  setIsRotationFinished,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { TransitionEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useViewerHandler() {
  const dispatch = useDispatch<AppDispatch>();

  const throttle = useThrottle();
  const debounce = useDebounce();

  const onMouseMove = useCallback(() => {
    if (canTouch) return;

    throttle(() => {
      dispatch(setIsMouseMoved(true));
      debounce(() => dispatch(setIsMouseMoved(false)), 2000);
    }, 100);
  }, [debounce, dispatch, throttle]);

  const onTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLElement>) => {
      if (event.propertyName === 'rotate') {
        dispatch(setIsRotationFinished(true));
        debounce(() => dispatch(setIsRotationFinished(false)), 2000);
      }
    },
    [debounce, dispatch]
  );

  return { onMouseMove, onTransitionEnd } as const;
}
