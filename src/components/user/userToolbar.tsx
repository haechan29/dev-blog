'use client';

import ToolbarProfileIcon from '@/components/post/toolbarProfileIcon';
import clsx from 'clsx';
import Link from 'next/link';

export default function UserToolbar({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'fixed top-0 z-40 w-full flex items-center justify-between',
        'py-2 md:py-3 px-4 md:px-6 bg-white/80 backdrop-blur-md',
        className
      )}
    >
      <Link href='/' className='p-2 -m-2'>
        <div className='text-2xl font-bold tracking-tight text-blue-500'>
          Haechan
        </div>
      </Link>

      <ToolbarProfileIcon />
    </div>
  );
}
