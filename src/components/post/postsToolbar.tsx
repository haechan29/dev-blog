'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export default function PostsToolbar() {
  const [searchKeyword, setSearchKeyword] = useState('');
  return (
    <div className='flex pl-6 pr-4 mb-4 border border-gray-200 rounded-full'>
      <input
        type='text'
        value={searchKeyword}
        onChange={e => setSearchKeyword(e.target.value)}
        placeholder='검색'
        className='flex-1 text-gray-900 outline-none'
      />
      <button className='p-2 cursor-pointer' onClick={() => {}}>
        <Search className='w-6 h-6 ' />
      </button>
    </div>
  );
}
