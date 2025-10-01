'use client';

import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import { setAreBarsVisible } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useBarsAutoHide = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isViewerMode } = usePostViewer();

  const debounce = useDebounce();
  const throttle = useThrottle();

  const showBarsAndHide = useCallback(() => {
    throttle(() => {
      dispatch(setAreBarsVisible(true));
      debounce(() => dispatch(setAreBarsVisible(false)), 3000);
    }, 100);
  }, [debounce, dispatch, throttle]);

  useEffect(() => {
    if (isViewerMode) {
      document.addEventListener('keydown', showBarsAndHide);
      document.addEventListener('mousemove', showBarsAndHide);
      document.addEventListener('wheel', showBarsAndHide);
      document.addEventListener('click', showBarsAndHide);
      document.addEventListener('touchend', showBarsAndHide);
    }
    return () => {
      document.removeEventListener('keydown', showBarsAndHide);
      document.removeEventListener('mousemove', showBarsAndHide);
      document.removeEventListener('wheel', showBarsAndHide);
      document.removeEventListener('click', showBarsAndHide);
      document.removeEventListener('touchend', showBarsAndHide);
    };
  }, [showBarsAndHide, isViewerMode]);
};
