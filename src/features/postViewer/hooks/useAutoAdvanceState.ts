'use client';

import {
  AutoAdvance,
  toProps as toAutoAdvanceProps,
} from '@/features/postViewer/domain/model/autoAdvance';
import { toProps as toPostViewerProps } from '@/features/postViewer/domain/model/postViewer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { nextPage, setAdvanceMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useAutoAdvanceState() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { pageIndex, totalPages, advanceMode } = useMemo(
    () => toPostViewerProps(postViewer),
    [postViewer]
  );

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

  useEffect(() => {
    if (!isAutoAdvanceEnabled || !autoAdvanceInterval) return;
    if (pageIndex >= totalPages - 1) return;

    const timer = setTimeout(() => {
      dispatch(nextPage());
    }, autoAdvanceInterval * 1000);

    return () => clearTimeout(timer);
  }, [
    autoAdvanceInterval,
    dispatch,
    isAutoAdvanceEnabled,
    pageIndex,
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
    cycleAutoAdvance,
  } as const;
}
