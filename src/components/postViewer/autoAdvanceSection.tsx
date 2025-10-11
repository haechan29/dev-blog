'use client';

import TooltipItem from '@/components/tooltipItem';
import useAutoAdvanceState from '@/features/postViewer/hooks/useAutoAdvanceState';
import { Timer, TimerOff } from 'lucide-react';

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
        {isAutoAdvanceEnabled ? (
          <Timer className='w-6 h-6 stroke-1 text-white' />
        ) : (
          <TimerOff className='w-6 h-6 stroke-1 text-white' />
        )}

        {isAutoAdvanceEnabled && (
          <div className='absolute top-[22px] left-[22px] flex justify-center items-center'>
            <div className='text-xs font-bold text-blue-600'>
              {autoAdvanceInterval}
            </div>
          </div>
        )}
      </button>
    </TooltipItem>
  );
}
