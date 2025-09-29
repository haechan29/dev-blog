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

  const handleMouseMove = useCallback(() => {
    throttle(() => {
      dispatch(setIsControlBarVisible(true));
      debounce(() => dispatch(setIsControlBarVisible(false)), 3000);
    }, 100);
  }, [debounce, dispatch, throttle]);

  useEffect(() => {
    if (isViewerMode) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, isViewerMode]);
};
