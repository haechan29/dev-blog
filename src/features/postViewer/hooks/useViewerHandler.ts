'use client';

import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import { canTouch } from '@/lib/browser';
import { setIsMouseMoved } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback } from 'react';
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

  return { onMouseMove } as const;
}
