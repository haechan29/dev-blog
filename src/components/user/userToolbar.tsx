'use client';

import Logo from '@/components/logo';
import ToolbarProfileIcon from '@/components/post/toolbarProfileIcon';
import clsx from 'clsx';

export default function UserToolbar({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'fixed top-0 z-40 w-full flex items-center justify-between',
        'py-2 md:py-3 px-4 md:px-6 bg-white/80 backdrop-blur-md',
        className
      )}
    >
      <Logo />
      <ToolbarProfileIcon />
    </div>
  );
}
