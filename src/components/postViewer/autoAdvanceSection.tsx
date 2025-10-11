'use client';

import TooltipItem from '@/components/tooltipItem';
import useAutoAdvanceState from '@/features/postViewer/hooks/useAutoAdvanceState';
import clsx from 'clsx';
import { Timer } from 'lucide-react';

export default function AutoAdvanceSection() {
  const { isAutoAdvanceEnabled, autoAdvanceInterval, onClick } =
    useAutoAdvanceState();

  return (
    <TooltipItem text='자동 넘김'>
      <button
        onClick={onClick}
        className='relative flex shrink-0 items-center p-2 cursor-pointer'
        aria-label={isAutoAdvanceEnabled ? '자동 넘김 중지' : '자동 넘김 시작'}
      >
        <Timer
          className={clsx(
            'icon',
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
