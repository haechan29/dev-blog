'use client';

import { toProps } from '@/features/postViewer/domain/model/postViewer';
import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import { setIsControlBarVisible } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useControlBarAutoHide = () => {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { isViewerMode } = useMemo(() => toProps(postViewer), [postViewer]);

  const debounce = useDebounce();
  const throttle = useThrottle();

  const showControlBarAndHide = useCallback(() => {
    throttle(() => {
      dispatch(setIsControlBarVisible(true));
      debounce(() => dispatch(setIsControlBarVisible(false)), 3000);
    }, 100);
  }, [debounce, dispatch, throttle]);

  useEffect(() => {
    if (isViewerMode) {
      document.addEventListener('keydown', showControlBarAndHide);
      document.addEventListener('mousemove', showControlBarAndHide);
      document.addEventListener('wheel', showControlBarAndHide);
      document.addEventListener('click', showControlBarAndHide);
      document.addEventListener('touchend', showControlBarAndHide);
    }
    return () => {
      document.removeEventListener('keydown', showControlBarAndHide);
      document.removeEventListener('mousemove', showControlBarAndHide);
      document.removeEventListener('wheel', showControlBarAndHide);
      document.removeEventListener('click', showControlBarAndHide);
      document.removeEventListener('touchend', showControlBarAndHide);
    };
  }, [showControlBarAndHide, isViewerMode]);
};
