'use client';

import Logo from '@/components/logo';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export default function WriteToolbar({
  onNext,
  isPending,
}: {
  onNext: () => void;
  isPending: boolean;
}) {
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
        onClick={onNext}
        disabled={isPending}
        className={clsx(
          'h-9 text-sm font-semibold py-2 px-4 rounded-full',
          'bg-blue-600 text-white',
          isPending ? 'opacity-50' : 'hover:bg-blue-500'
        )}
      >
        {isPending ? <Loader2 size={16} className='animate-spin' /> : '발행'}
      </button>
    </div>
  );
}
