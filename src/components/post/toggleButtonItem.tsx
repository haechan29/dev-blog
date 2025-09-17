'use client';

import clsx from 'clsx';
import { ReactNode, useState } from 'react';

export default function ToggleButtonItem({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <button
      onClick={() => setIsClicked(prev => !prev)}
      className={clsx(
        className,
        'px-1 rounded-sm transition-colors duration-300 ease-in-out',
        !isClicked && 'bg-gray-200 text-transparent hover:bg-gray-300'
      )}
      {...props}
    >
      {children}
    </button>
  );
}
