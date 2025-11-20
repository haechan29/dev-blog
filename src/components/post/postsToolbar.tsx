'use client';

import SidebarButton from '@/components/post/sidebarButton';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PostsToolbar({ className }: { className?: string }) {
  const [query, setQuery] = useState('');

  return (
    <div
      className={cn(
        'fixed top-0 z-40 w-full flex items-center',
        'p-2 gap-4 bg-white/80 backdrop-blur-md',
        className
      )}
    >
      <div className='xl:hidden'>
        <SidebarButton />
      </div>

      <div className='flex-1 min-w-0'>
        <div
          className={clsx(
            'hidden md:block w-full',
            'xl:pl-[var(--sidebar-width)]',
            'xl:pr-[calc(var(--toc-width)+var(--toc-margin))]'
          )}
        >
          <div className='flex w-full max-w-3/4 mx-auto pl-6 pr-4 py-2 border border-gray-200 rounded-full'>
            <input
              type='text'
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='검색'
              className='flex-1 min-w-0 text-gray-900 outline-none'
            />
            <SearchButton />
          </div>
        </div>
      </div>

      <div className='flex items-center'>
        <Link
          href={`/write?step=write`}
          className={clsx(
            'text-sm font-semibold py-2 px-4 mr-2 rounded-full',
            'bg-gray-200 hover:bg-gray-300'
          )}
        >
          {'글 쓰기'}
        </Link>
        <div className='block md:hidden'>
          <SearchButton />
        </div>
      </div>
    </div>
  );
}

function SearchButton() {
  return (
    <button className='shrink-0 px-2 cursor-pointer' onClick={() => {}}>
      <Search className='w-6 h-6 ' />
    </button>
  );
}
