'use client';

import { toProps } from '@/features/postViewer/domain/model/postViewer';
import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import { setAreBarsVisible } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useBarsAutoHide = () => {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isViewerMode } = useMemo(() => toProps(postViewer), [postViewer]);

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
