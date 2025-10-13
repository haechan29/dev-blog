'use client';

import clsx from 'clsx';
import { ReactNode, useState } from 'react';

export default function ToggleButton({ children }: { children: ReactNode }) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <button
      onClick={() => setIsClicked(prev => !prev)}
      className={clsx(
        'rounded-sm transition-colors duration-300 ease-in-out mb-2',
        !isClicked && 'bg-gray-200 text-transparent hover:bg-gray-300'
      )}
    >
      {children}
    </button>
  );
}
