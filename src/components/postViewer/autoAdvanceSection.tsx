'use client';

import TooltipItem from '@/components/tooltipItem';
import { AutoAdvance, toProps } from '@/features/post/domain/model/autoAdvance';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { nextPage } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import clsx from 'clsx';
import { Timer } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

export default function AutoAdvanceSection({
  pageIndex,
  totalPages,
}: {
  pageIndex: number;
  totalPages: number;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const [autoAdvance, setAutoAdvance] = useLocalStorage<AutoAdvance>(
    'auto-advance-settings',
    {
      type: 'NotEnabled',
    }
  );

  const { isAutoAdvanceEnabled, autoAdvanceInterval } = useMemo(
    () => toProps(autoAdvance),
    [autoAdvance]
  );

  const handleAutoAdvanceClick = useCallback(() => {
    const intervals = [60, 90, 120];
    const currentIndex =
      autoAdvanceInterval !== undefined
        ? intervals.indexOf(autoAdvanceInterval)
        : -1;

    if (currentIndex === intervals.length - 1) {
      setAutoAdvance({
        type: 'NotEnabled',
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
    dispatch,
    isAutoAdvanceEnabled,
    autoAdvanceInterval,
    pageIndex,
    totalPages,
  ]);

  return (
    <TooltipItem text='자동 넘김'>
      <button
        onClick={handleAutoAdvanceClick}
        className='relative flex shrink-0 items-center p-2 cursor-pointer'
        aria-label={isAutoAdvanceEnabled ? '자동 넘김 중지' : '자동 넘김 시작'}
      >
        <Timer
          className={clsx(
            'w-6 h-6',
            isAutoAdvanceEnabled ? 'text-gray-900' : 'text-gray-400'
          )}
        />
        {isAutoAdvanceEnabled && (
          <div className='absolute top-[22px] left-[22px] flex justify-center items-center bg-white'>
            <div className='text-xs font-bold text-blue-600'>
              {autoAdvanceInterval}
            </div>
          </div>
        )}
      </button>
    </TooltipItem>
  );
}
