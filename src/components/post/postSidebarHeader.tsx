'use client';

import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import { AppDispatch } from '@/lib/redux/store';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

export default function PostSidebarHeader() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className='flex w-full min-w-0 px-6 py-9'>
      <Link
        onClick={() => dispatch(setIsVisible(false))}
        className='flex flex-col min-w-0 px-3 py-3'
        href='/posts'
      >
        <div className='text-2xl font-bold tracking-tight text-blue-500'>
          Haechan
        </div>
        <div className='text-xs text-gray-400 mt-1 font-light tracking-wide'>
          DEV BLOG
        </div>
      </Link>
    </div>
  );
}
