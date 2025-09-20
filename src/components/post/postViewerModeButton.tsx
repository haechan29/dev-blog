'use client';

import clsx from 'clsx';
import { BookOpenText } from 'lucide-react';
import { useState } from 'react';

export default function PostViewerModeButton() {
  const [isViewerMode, setIsViewerMode] = useState(false);

  return (
    <button
      onClick={() => setIsViewerMode(prev => !prev)}
      className={clsx(
        'fixed bottom-4 right-4 xl:bottom-10 xl:right-10 flex shrink-0 justify-center items-center rounded-full',
        'bg-white shadow-lg p-3 border border-gray-100'
      )}
    >
      <BookOpenText className='w-6 h-6 text-black stroke-2 hover:scale-110' />
    </button>
  );
}
