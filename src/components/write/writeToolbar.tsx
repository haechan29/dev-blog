'use client';

import Logo from '@/components/logo';
import clsx from 'clsx';
import { Check, Loader2 } from 'lucide-react';

export default function WriteToolbar({
  onNext,
  isPublishPending,
  onSave,
  isSavePending,
  saveJustSucceeded,
}: {
  onNext: () => void;
  isPublishPending: boolean;
  onSave: () => void;
  isSavePending: boolean;
  saveJustSucceeded: boolean;
}) {
  const isAnyPending = isPublishPending || isSavePending;

  return (
    <div
      className={clsx(
        'fixed top-0 z-40 w-full flex items-center',
        'py-2 md:py-3 px-4 md:px-6 gap-4 bg-white/80 backdrop-blur-md'
      )}
    >
      <Logo />

      <div className='flex-1' />

      <button
        onClick={onSave}
        disabled={isAnyPending}
        className={clsx(
          'h-9 text-sm font-semibold py-2 px-4 rounded-full cursor-pointer',
          'border border-gray-300 text-gray-700 bg-white',
          isAnyPending ? 'opacity-50' : 'hover:bg-gray-50'
        )}
      >
        {isSavePending ? (
          <Loader2 size={16} className='animate-spin' />
        ) : saveJustSucceeded ? (
          <Check strokeWidth={3} size={16} className='text-blue-600' />
        ) : (
          '저장'
        )}
      </button>

      <button
        onClick={onNext}
        disabled={isAnyPending}
        className={clsx(
          'h-9 text-sm font-semibold py-2 px-4 rounded-full cursor-pointer',
          'bg-blue-600 text-white',
          isAnyPending ? 'opacity-50' : 'hover:bg-blue-500'
        )}
      >
        {isPublishPending ? (
          <Loader2 size={16} className='animate-spin' />
        ) : (
          '발행'
        )}
      </button>
    </div>
  );
}
