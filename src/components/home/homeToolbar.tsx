'use client';

import Logo from '@/components/logo';
import SearchCommand from '@/components/post/searchCommand';
import ToolbarProfileIcon from '@/components/post/toolbarProfileIcon';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function HomeToolbar({
  isLoggedIn,
  className,
}: {
  isLoggedIn: boolean;
  className?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState('');

  return (
    <div
      className={cn(
        'fixed top-0 z-40 w-full flex items-center',
        'py-2 md:py-3 px-4 md:px-6 gap-4 bg-white/80 backdrop-blur-md',
        className
      )}
    >
      <Logo onClick={() => dispatch(setIsVisible(false))} />

      <div className='flex flex-1 min-w-0 justify-center'>
        <div className='max-md:hidden w-1/2'>
          <SearchCommand onSelect={() => {}} />
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <Link
          href={`/write?step=write`}
          className={clsx(
            'text-sm font-semibold py-2 px-4 rounded-full',
            'bg-gray-100 hover:bg-gray-200'
          )}
        >
          {'글 쓰기'}
        </Link>

        <button
          className='md:hidden shrink-0 p-2 -m-2 cursor-pointer'
          onClick={() => {}}
          aria-label='검색'
        >
          <Search className='w-5 h-5' />
        </button>

        <ToolbarProfileIcon isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
