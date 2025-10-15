'use client';

import SidebarButton from '@/components/post/sidebarButton';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function PostsToolbar() {
  return (
    <div
      className={clsx(
        'sticky top-0 z-40 w-full flex items-center',
        'p-2 md:p-4 lg:p-6 gap-4 bg-white/80 backdrop-blur-md'
      )}
    >
      <div className='xl:hidden'>
        <SidebarButton />
      </div>

      <div className='flex-1 min-w-0'>
        <div className='hidden md:block w-full'>
          <SearchBar />
        </div>
      </div>

      <div className='flex md:hidden'>
        <SearchButton />
      </div>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  return (
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
  );
}

function SearchButton() {
  return (
    <button className='shrink-0 px-2 cursor-pointer' onClick={() => {}}>
      <Search className='w-6 h-6 ' />
    </button>
  );
}
