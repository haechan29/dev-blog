'use client';

import {
  AutoAdvance,
  toProps as toAutoAdvanceProps,
} from '@/features/postViewer/domain/model/autoAdvance';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useDebounce from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { nextPage } from '@/lib/redux/postPositionSlice';
import {
  setAdvanceMode,
  setIsControlBarTouched,
} from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function useAutoAdvanceState() {
  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();
  const { pageNumber, totalPages, advanceMode } = usePostViewer();

  const [autoAdvance, setAutoAdvance] = useLocalStorage<AutoAdvance>(
    'auto-advance-settings',
    {
      type: 'Disabled',
    }
  );

  const { isAutoAdvanceEnabled, autoAdvanceInterval } = useMemo(
    () => toAutoAdvanceProps(autoAdvance),
    [autoAdvance]
  );

  const cycleAutoAdvance = useCallback(() => {
    const intervals = [60, 90, 120];
    const currentIndex =
      autoAdvanceInterval !== undefined
        ? intervals.indexOf(autoAdvanceInterval)
        : -1;

    if (currentIndex === intervals.length - 1) {
      setAutoAdvance({
        type: 'Disabled',
      });
    } else {
      setAutoAdvance({
        type: 'Enabled',
        interval: intervals[currentIndex + 1],
      });
    }
  }, [autoAdvanceInterval, setAutoAdvance]);

  const onClick = useCallback(() => {
    cycleAutoAdvance();

    dispatch(setIsControlBarTouched(true));
    debounce(() => dispatch(setIsControlBarTouched(false)), 2000);
  }, [cycleAutoAdvance, debounce, dispatch]);

  useEffect(() => {
    if (!isAutoAdvanceEnabled || !autoAdvanceInterval) return;
    if (pageNumber !== null && totalPages !== null && pageNumber >= totalPages)
      return;

    const timer = setTimeout(() => {
      dispatch(nextPage());
    }, autoAdvanceInterval * 1000);

    return () => clearTimeout(timer);
  }, [
    autoAdvanceInterval,
    dispatch,
    isAutoAdvanceEnabled,
    pageNumber,
    totalPages,
  ]);

  useEffect(() => {
    dispatch(setAdvanceMode(isAutoAdvanceEnabled ? 'auto' : null));
  }, [dispatch, isAutoAdvanceEnabled]);

  useEffect(() => {
    if (advanceMode !== null && advanceMode !== 'auto') {
      setAutoAdvance({
        type: 'Disabled',
      });
    }
  }, [advanceMode, setAutoAdvance]);

  return {
    isAutoAdvanceEnabled,
    autoAdvanceInterval,
    onClick,
  } as const;
}
